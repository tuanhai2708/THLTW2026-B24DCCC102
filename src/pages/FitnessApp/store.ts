export interface Workout {
  id: string;
  date: string;
  type: string;
  duration: number; // in minutes
  calories: number;
  notes: string;
  status: 'Completed' | 'Missed';
}

export interface HealthMetric {
  id: string;
  date: string;
  weight: number; // in kg
  height: number; // in cm
  restingHeartRate: number; // in bpm
  sleepHours: number;
}

export interface FitnessGoal {
  id: string;
  name: string;
  type: 'Giảm cân' | 'Tăng cơ' | 'Cải thiện sức bền' | 'Khác';
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  description: string;
  caloriesPerHour: number;
  instructions: string;
}

// Initial Mock Data
const MOCK_WORKOUTS: Workout[] = [
  { id: '1', date: '2023-10-01', type: 'Cardio', duration: 30, calories: 300, notes: 'Chạy bộ buổi sáng', status: 'Completed' },
  { id: '2', date: '2023-10-03', type: 'Strength', duration: 45, calories: 400, notes: 'Tập ngực', status: 'Completed' },
  { id: '3', date: '2023-10-05', type: 'Yoga', duration: 60, calories: 200, notes: 'Thư giãn', status: 'Completed' },
  { id: '4', date: '2023-10-07', type: 'HIIT', duration: 20, calories: 250, notes: 'Tập cường độ cao', status: 'Missed' },
  { id: '5', date: '2023-10-09', type: 'Cardio', duration: 40, calories: 350, notes: 'Đạp xe', status: 'Completed' },
];

const MOCK_METRICS: HealthMetric[] = [
  { id: '1', date: '2023-10-01', weight: 70, height: 175, restingHeartRate: 65, sleepHours: 8 },
  { id: '2', date: '2023-10-08', weight: 69.5, height: 175, restingHeartRate: 64, sleepHours: 7.5 },
];

const MOCK_GOALS: FitnessGoal[] = [
  { id: '1', name: 'Giảm 5kg', type: 'Giảm cân', targetValue: 65, currentValue: 69.5, deadline: '2023-12-31', status: 'Đang thực hiện' },
  { id: '2', name: 'Chạy 10km', type: 'Cải thiện sức bền', targetValue: 10, currentValue: 5, deadline: '2023-11-30', status: 'Đang thực hiện' },
];

const MOCK_EXERCISES: Exercise[] = [
  { id: '1', name: 'Push-up', muscleGroup: 'Chest', difficulty: 'Trung bình', description: 'Bài tập cơ ngực cơ bản', caloriesPerHour: 400, instructions: '1. Nằm sấp...\n2. Chống tay...\n3. Đẩy người lên...' },
  { id: '2', name: 'Squat', muscleGroup: 'Legs', difficulty: 'Dễ', description: 'Bài tập cơ đùi và mông', caloriesPerHour: 450, instructions: '1. Đứng thẳng...\n2. Hạ người xuống...\n3. Đứng lên...' },
  { id: '3', name: 'Pull-up', muscleGroup: 'Back', difficulty: 'Khó', description: 'Bài tập kéo xà đơn', caloriesPerHour: 500, instructions: '1. Nắm xà...\n2. Kéo người lên...\n3. Hạ người xuống...' },
  { id: '4', name: 'Plank', muscleGroup: 'Core', difficulty: 'Dễ', description: 'Bài tập cơ bụng tĩnh', caloriesPerHour: 300, instructions: '1. Chống tay...\n2. Giữ thân người thẳng...\n3. Giữ càng lâu càng tốt...' },
  { id: '5', name: 'Burpee', muscleGroup: 'Full Body', difficulty: 'Khó', description: 'Bài tập toàn thân cường độ cao', caloriesPerHour: 600, instructions: '1. Đứng thẳng...\n2. Nằm sấp...\n3. Đẩy người lên...\n4. Nhảy lên cao...' },
  { id: '6', name: 'Dumbbell Curl', muscleGroup: 'Arms', difficulty: 'Dễ', description: 'Bài tập cuốn tạ tay', caloriesPerHour: 250, instructions: '1. Cầm tạ...\n2. Cuốn tạ lên...\n3. Hạ tạ xuống...' },
];

export const getWorkouts = (): Workout[] => {
  const data = localStorage.getItem('fitness_workouts');
  return data ? JSON.parse(data) : MOCK_WORKOUTS;
};
export const saveWorkouts = (workouts: Workout[]) => localStorage.setItem('fitness_workouts', JSON.stringify(workouts));

export const getMetrics = (): HealthMetric[] => {
  const data = localStorage.getItem('fitness_metrics');
  return data ? JSON.parse(data) : MOCK_METRICS;
};
export const saveMetrics = (metrics: HealthMetric[]) => localStorage.setItem('fitness_metrics', JSON.stringify(metrics));

export const getGoals = (): FitnessGoal[] => {
  const data = localStorage.getItem('fitness_goals');
  return data ? JSON.parse(data) : MOCK_GOALS;
};
export const saveGoals = (goals: FitnessGoal[]) => localStorage.setItem('fitness_goals', JSON.stringify(goals));

export const getExercises = (): Exercise[] => {
  const data = localStorage.getItem('fitness_exercises');
  return data ? JSON.parse(data) : MOCK_EXERCISES;
};
export const saveExercises = (exercises: Exercise[]) => localStorage.setItem('fitness_exercises', JSON.stringify(exercises));
