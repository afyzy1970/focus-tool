'use client';

import React, { useState, useEffect } from 'react';
import { Timer, Settings, CheckCircle, List, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Input } from './ui/input'

const FocusTools = () => {
  const [activeTab, setActiveTab] = useState('timer');
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [selectedTask, setSelectedTask] = useState(null);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);

  // 当页面加载时从 localStorage 读取数据
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedSessions = localStorage.getItem('focusSessions');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedSessions) {
      setFocusSessions(JSON.parse(savedSessions));
    }
  }, []);

  // 当数据更改时保存到 localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('focusSessions', JSON.stringify(focusSessions));
  }, [tasks, focusSessions]);

  // 计时器逻辑
  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      if (selectedTask) {
        const newSession = {
          task: selectedTask,
          duration: 25,
          timestamp: new Date().toISOString(),
          completed: true
        };
        setFocusSessions(prev => [...prev, newSession]);
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, selectedTask]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(25 * 60);
  };

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask('');
    }
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  // 计算统计数据
  const getDailyStats = () => {
    const stats = focusSessions.reduce((acc, session) => {
      const date = session.timestamp.split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          totalMinutes: 0,
          completedTasks: 0
        };
      }
      acc[date].totalMinutes += session.duration;
      if (session.completed) {
        acc[date].completedTasks += 1;
      }
      return acc;
    }, {});

    return Object.entries(stats).map(([date, data]) => ({
      date,
      totalHours: data.totalMinutes / 60,
      completedTasks: data.completedTasks,
      efficiency: (data.completedTasks * data.totalMinutes) / (25 * 100)
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex space-x-4 mb-4">
        <button 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'timer' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setActiveTab('timer')}
        >
          <Timer className="w-4 h-4" />
          专注计时
        </button>
        <button 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'tasks' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setActiveTab('tasks')}
        >
          <List className="w-4 h-4" />
          任务列表
        </button>
        <button 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'stats' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart2 className="w-4 h-4" />
          专注统计
        </button>
      </div>

      {activeTab === 'timer' && (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">专注计时器</h2>
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">当前任务</h3>
              {selectedTask ? (
                <div className="p-4 bg-blue-50 rounded-lg flex justify-between items-center">
                  <span>{selectedTask}</span>
                  <button 
                    className="text-sm text-blue-500 hover:text-blue-700"
                    onClick={() => setSelectedTask(null)}
                  >
                    切换任务
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-500">选择要专注的任务：</p>
                  <div className="max-h-40 overflow-y-auto">
                    {tasks.map((task, index) => (
                      !task.completed && (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => setSelectedTask(task.text)}
                        >
                          {task.text}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="text-center mb-6">
              <div className="text-6xl font-mono mb-4">{formatTime(time)}</div>
              <div className="space-x-4">
                <button
                  className={`px-6 py-2 rounded-lg ${
                    isRunning 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                  onClick={toggleTimer}
                  disabled={!selectedTask}
                >
                  {isRunning ? '暂停' : '开始'}
                </button>
                <button
                  className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  onClick={resetTimer}
                >
                  重置
                </button>
              </div>
            </div>
            {!selectedTask && (
              <p className="text-sm text-gray-500 text-center">请先选择一个任务开始专注</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">任务管理</h2>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="添加新任务..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <button
                onClick={addTask}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                添加
              </button>
            </div>
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                >
                  <CheckCircle
                    className={`w-5 h-5 cursor-pointer ${
                      task.completed ? 'text-green-500' : 'text-gray-300'
                    }`}
                    onClick={() => toggleTask(index)}
                  />
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">本周专注统计</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getDailyStats().slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('zh-CN', { weekday: 'short' })}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'totalHours') return `${value.toFixed(1)}小时`;
                      if (name === 'completedTasks') return `${value}个任务`;
                      return `${value.toFixed(1)}%`;
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="totalHours" 
                    stroke="#8884d8" 
                    name="专注时长"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="completedTasks" 
                    stroke="#82ca9d" 
                    name="完成任务数"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#ffc658" 
                    name="效率得分"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">近期专注记录</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {focusSessions.slice().reverse().map((session, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-medium">{session.task}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(session.timestamp).toLocaleString('zh-CN')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">{session.duration}分钟</span>
                    {session.completed && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusTools;