import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './BottomTabs';

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
