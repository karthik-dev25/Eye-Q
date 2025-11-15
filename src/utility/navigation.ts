export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  ColorVisionTest: undefined;
  RightEyeTest: undefined;
  LeftEyeTest: undefined;
  Scores?: undefined;
  DistanceVision?: undefined;
  AmslerTest?: undefined;
  StereopsisTest?: undefined;
  TestScores: undefined;

  ContrastSensitivityMenu: undefined;
  RightEyeContrast: undefined;
  LeftEyeContrast: undefined;

  NearVisionMenu?: undefined;
  NearVisionRight: { language: string } | undefined;
  NearVisionLeft: { language: string } | undefined;
};
