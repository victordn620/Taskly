import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeContext';
import { HomeScreen } from '../screens/HomeScreen';
import { ProjectsScreen } from '../screens/projects/ProjectsScreen';
import { TasksScreen } from '../screens/tasks/TasksScreen';
import { TaskDetailsScreen } from '../screens/tasks/TaskDetailsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import {
  MainTabParamList,
  TasksStackParamList,
} from '../types';
import { BORDER_RADIUS, FONT_SIZE, SPACING } from '../styles/theme';

// ─── Tasks stack (Tasks list + Task details) ──────────────────────────────────

const TasksStack = createNativeStackNavigator<TasksStackParamList>();

function TasksNavigator() {
  return (
    <TasksStack.Navigator screenOptions={{ headerShown: false }}>
      <TasksStack.Screen name="TasksList" component={TasksScreen} />
      <TasksStack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </TasksStack.Navigator>
  );
}

// ─── Bottom tab bar ──────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.xs,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            Home: ['home', 'home-outline'],
            Projects: ['briefcase', 'briefcase-outline'],
            Tasks: ['checkbox', 'checkbox-outline'],
            Profile: ['person-circle', 'person-circle-outline'],
          };
          const [active, inactive] = icons[route.name] || ['ellipse', 'ellipse-outline'];
          return (
            <Ionicons
              name={(focused ? active : inactive) as any}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Início' }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{ tabBarLabel: 'Projetos' }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksNavigator}
        options={{ tabBarLabel: 'Tarefas' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
