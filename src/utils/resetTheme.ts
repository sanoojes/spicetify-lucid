import appStore from '@/store/appStore.ts';

function resetTheme() {
  appStore.getState().resetStore();
  location.reload();
}

export default resetTheme;
