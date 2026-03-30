import { createLogger } from '@/logger.ts';
import appStore from '@/store/appStore.ts';
import { io, type Socket } from 'socket.io-client';

const logger = createLogger('[Analytics]');
const ANALYTIC_SERVER_URL = 'https://analytics-spicetify-projects.sanooj.uk';
const USER_ID_LOCAL_KEY = 'lucid:theme:userId';

type AnalyticType = 'theme' | 'lyrics_extension' | 'glassify_theme';
const TYPE: AnalyticType = 'theme';

let socket: Socket | null = null;

export async function setupAnalytics(
  isAnalyticsActive: boolean = appStore.getState().isAnalyticsActive
) {
  try {
    if (!isAnalyticsActive) {
      if (socket) {
        socket.disconnect();
        socket = null;
        logger.info('Disconnected');
      }
      return;
    }

    if (socket?.connected) {
      logger.info('Already active');
      return;
    }

    const pingRes = await fetch(`${ANALYTIC_SERVER_URL}/ping`);
    if (!pingRes.ok) {
      logger.error('Server ping failed, not starting socket.');
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      return;
    }

    socket = io(`${ANALYTIC_SERVER_URL}/ws/users`, {
      auth: { type: TYPE },
      closeOnBeforeunload: true,
    });

    socket.on('assignedUserId', ({ userId: assignedId }: { userId: string }) => {
      if (!getUserId()) {
        setUserId(assignedId);
        logger.info('Assigned new userId:', assignedId);
      }
    });

    let connectionAttempts = 0;
    const MAX_RETRIES = 3;

    socket.on('connect', () => {
      const userId = getUserId() ?? undefined;
      socket?.emit('getUserId', userId);

      logger.info('Connected');
      connectionAttempts = 0;
    });

    socket.on('disconnect', (reason) => {
      logger.info('Disconnected:', reason);
    });

    socket.on('connect_error', (err: Error) => {
      logger.error('Connection error:', err.message);
      connectionAttempts++;

      if (connectionAttempts >= MAX_RETRIES) {
        logger.error(`Server unreachable after ${MAX_RETRIES} attempts. Stopping socket.`);
        socket?.disconnect();
        socket = null;
        return;
      }

      setTimeout(async () => {
        logger.info('Retrying connection...');
        await setupAnalytics(true);
      }, 5000);
    });
  } catch (err: any) {
    logger.error('Setup Error:', err.message ?? err);
  }
}

appStore.subscribe((state) => state.isAnalyticsActive, setupAnalytics);

function getUserId(): string | null {
  return localStorage.getItem(USER_ID_LOCAL_KEY) ?? null;
}

function setUserId(userId: string) {
  localStorage.setItem(USER_ID_LOCAL_KEY, userId);
}
