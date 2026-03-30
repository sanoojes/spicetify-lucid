import UI from '@/components/ui';
import { Dismiss16Filled } from '@fluentui/react-icons';
import { useEffect, useState } from 'react';

type NotificationProps = {
  message: React.ReactNode;
  isError?: boolean;
  timeout?: number;
  onClose: () => void;
};

const FADE_DURATION = 500;

const Notification: React.FC<NotificationProps> = ({
  message,
  isError = false,
  timeout = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, FADE_DURATION);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onClose]);

  const handleManualClose = () => {
    setVisible(false);
    setTimeout(onClose, FADE_DURATION);
  };

  return (
    <div className={`notification${isError ? ' error' : ''}${!visible ? ' fade-out' : ''}`}>
      <span>{message}</span>
      <UI.Button
        className="notification-close"
        variant="icon-no-border"
        onClick={handleManualClose}
      >
        <Dismiss16Filled />
      </UI.Button>
    </div>
  );
};

export default Notification;
