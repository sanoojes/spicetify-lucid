import UI from '@components/ui';
import { Dismiss16Filled } from '@fluentui/react-icons';
import DiscordIcon from '@icons/discord-16.svg';
import GithubIcon from '@icons/github-16.svg';

const HeaderButtons: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const openLink = (url: string) => open(url, '_blank', 'noopener,noreferrer');

  return (
    <>
      <UI.Button
        variant="icon"
        className="discord"
        onClick={() => openLink('https://social.sanooj.uk/spicetify-discord')}
        aria-label="Join Discord"
      >
        <DiscordIcon />
      </UI.Button>
      <UI.Button
        variant="icon"
        className="github"
        onClick={() => openLink('https://github.com/sanoojes/spicetify-lucid')}
        aria-label="View on GitHub"
      >
        <GithubIcon />
      </UI.Button>
      <UI.Button variant="icon" onClick={closeModal} aria-label="Close Modal">
        <Dismiss16Filled />
      </UI.Button>
    </>
  );
};

export default HeaderButtons;
