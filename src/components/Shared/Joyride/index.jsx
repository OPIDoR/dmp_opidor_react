import { JoyrideProvider } from './JoyrideContext.jsx';
import Joyride from './Joyride.jsx';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => (
  <JoyrideProvider>
    <Joyride {...props} />
  </JoyrideProvider>
);
