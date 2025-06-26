import { JoyrideProvider } from './JoyrideContext.jsx';
import Joyride from './Joyride.jsx';

export default (props) => (
  <JoyrideProvider>
    <Joyride {...props} />
  </JoyrideProvider>
);
