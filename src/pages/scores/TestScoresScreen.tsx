/* eslint-disable react-native/no-inline-styles */
// src/screens/TestScoresScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../utility/constant';

interface TestScore {
  _id: string;
  userId: string;
  testName: string;
  testTotalScore: number;
  testScore: number;
  remark: string;
  updatedAt: string;
}

const NotAllowed = [
  'Left Eye Distance Vision Tumbling E',
  'Right Eye Distance Vision Tumbling E',
  'Left Eye Distance Vision Sloan Letters',
  'Right Eye Distance Vision Sloan Letters',
  'Left Eye Distance Vision Numbers',
  'Right Eye Distance Vision Numbers',
];

export default function TestScoresScreen() {
  const [scores, setScores] = useState<TestScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fetchScores = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        setErrorMsg('No user ID found.');
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/testscore/${userId}`);

      setScores(res.data.scores || []);
      setLoading(false);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Error fetching scores');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchScores().finally(() => setRefreshing(false));
  }, []);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  const renderItem = ({ item }: { item: TestScore }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.testName}>{item.testName}</Text>

        {!NotAllowed.includes(item.testName) ? (
          <Text style={styles.score}>
            Score: {item.testScore} / {item.testTotalScore}
          </Text>
        ) : (
          <Text style={styles.score}>Score: {item.testScore}</Text>
        )}
        <Text style={styles.score}>Remark: {item.remark}</Text>
        <Text style={styles.date}>
          Last Taken on: {formatDate(item.updatedAt)}
        </Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading test scores…</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Test Scores</Text>

      <FlatList
        data={scores}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No test scores found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center',
  },
  card: {
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 3,
  },
  testName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  score: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: 'gray',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});
