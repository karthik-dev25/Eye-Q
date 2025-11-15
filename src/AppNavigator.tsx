// App.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./utility/navigation";
import LoginScreen from "./auth/LoginScreen";
import SignupScreen from "./auth/SignupScreen";
import MainScreen from "./pages/MainScreen";
import ColorVisionTestScreen from "./pages/color-vision/ColorVisionTestScreen";
import RightEyeTestScreen from "./pages/color-vision/RightEyeTestScreen";
import LeftEyeTestScreen from "./pages/color-vision/LeftEyeTestScreen";
import TestScoresScreen from "./pages/scores/TestScoresScreen";
import StereopsisTestScreen from "./pages/stereopsis/StereopsisTestScreen";
import NearVisionMenuScreen from "./pages/nearvision/NearVisionMenuScreen";
import NearVisionRightScreen from "./pages/nearvision/NearVisionRightScreen";
import NearVisionLeftScreen from "./pages/nearvision/NearVisionLeftScreen";
import ContrastSensitivityMenuScreen from "./pages/contrastSensitivity/ContrastSensitivityMenuScreen";
import RightEyeContrastScreen from "./pages/contrastSensitivity/RightEyeContrastScreen";
import LeftEyeContrastScreen from "./pages/contrastSensitivity/LeftEyeContrastScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* After login, user cannot go back */}
        <Stack.Screen name="Main" component={MainScreen} />

        {/** Near Vision Screens */}
         <Stack.Screen name="NearVisionMenu" component={NearVisionMenuScreen} />
        <Stack.Screen name="NearVisionRight" component={NearVisionRightScreen} />
        <Stack.Screen name="NearVisionLeft" component={NearVisionLeftScreen} />

        {/* Contrast Menu */}
        <Stack.Screen name="ContrastSensitivityMenu" component={ContrastSensitivityMenuScreen} />
        <Stack.Screen name="RightEyeContrast" component={RightEyeContrastScreen} />
        <Stack.Screen name="LeftEyeContrast" component={LeftEyeContrastScreen} />

        <Stack.Screen name="ColorVisionTest" component={ColorVisionTestScreen} />

        {/* Navigate tests in replace mode */}
        <Stack.Screen name="RightEyeTest" component={RightEyeTestScreen} />
        <Stack.Screen name="LeftEyeTest" component={LeftEyeTestScreen} />
        
        <Stack.Screen name="StereopsisTest" component={StereopsisTestScreen} />

        <Stack.Screen name="TestScores" component={TestScoresScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
