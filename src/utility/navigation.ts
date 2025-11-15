export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  ColorVisionTest: undefined;
  RightEyeTest: undefined;
  LeftEyeTest: undefined;
  Scores?: undefined;
  AmslerTest?: undefined;
  StereopsisTest?: undefined;
  TestScores: undefined;

  DistanceVisionTest?: undefined;
  DVTestTypeSelect: {
    onSelect: (testName: string) => void;
  };

  RightEyeDV: {
    testType: string;
  };

  LeftEyeDV: {
    testType: string;
  };

  DVResults: {
    lastCorrect: number;
    eye: string;
    testType: string;
  };
  

  ContrastSensitivityMenu: undefined;
  RightEyeContrast: undefined;
  LeftEyeContrast: undefined;

  NearVisionMenu?: undefined;
  NearVisionRight: { language: string } | undefined;
  NearVisionLeft: { language: string } | undefined;
};
