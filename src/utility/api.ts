// src/services/api.ts
import axios from "axios";
import { API_URL } from "../utility/constant";

export const saveTestScore = async (payload: {
  userId: string;
  testName: string;
  testTotalScore: number;
  testScore: number;
  remark: string;
}) => {
  const res = await axios.post(`${API_URL}/testscore`, payload);
  return res.data;
};
