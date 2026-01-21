'use client';
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Target, TrendingUp, Calendar, Code, ListChecks, Briefcase, Clock, Zap } from 'lucide-react';

  type DSAProblem = {
    id: number;
    title: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    source: 'SWE180' | 'Striver A2Z' | 'Other';
    completed: boolean;
    completedDate: string | null;
  };

  type RoutineTask = {
    id: number;
    title: string;
    completed: boolean;
  };

  type SDTopic = {
    id: number;
    title: string;
    completed: boolean;
  };


export default function DSARoutineTracker() {
  const [activeTab, setActiveTab] = useState('dsa');
  const [dsaProblems, setDsaProblems] = useState<DSAProblem[]>([]);
  const [routineTasks, setRoutineTasks] = useState<RoutineTask[]>([]);
  const [systemDesignTopics, setSystemDesignTopics] = useState<SDTopic[]>([]);
  const [newProblem, setNewProblem] = useState<Omit<DSAProblem, 'id' | 'completed' | 'completedDate'>>({
    title: '',
    difficulty: 'Medium',
    topic: '',
    source: 'SWE180'
  });
  const [newTask, setNewTask] = useState('');
  const [newSDTopic, setNewSDTopic] = useState('');
  const [stats, setStats] = useState({ solved: 0, total: 0, streak: 0 });

  // Key Dates
  const today = new Date();
  const startApplying = new Date('2026-03-25');
  const offerDeadline = new Date('2026-05-01');
  const targetJoinDate = new Date('2026-07-01');


  const daysToApply = Math.ceil((startApplying.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysToOffer = Math.ceil((offerDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysToJoin = Math.ceil((targetJoinDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));


  // Phase Detection
  const getCurrentPhase = () => {
    if (today < new Date('2026-03-01')) return 'Phase 1: SWE180 Beginner';
    if (today < new Date('2026-05-01')) return 'Phase 2: Striver A2Z + Apply';
    return 'Phase 3: Interviews + Deep Prep';
  };

  useEffect(() => {
    const todayStr = new Date().toDateString();
    const savedDate = localStorage.getItem('lastVisit');

    if (savedDate !== todayStr) {
      setRoutineTasks(prev => prev.map(task => ({ ...task, completed: false })));
      localStorage.setItem('lastVisit', todayStr);
    }
  }, []);

  useEffect(() => {
    const solved = dsaProblems.filter(p => p.completed).length;
    setStats({ solved, total: dsaProblems.length, streak: calculateStreak() });
  }, [dsaProblems]);

  const calculateStreak = () => {
    const dates = dsaProblems
      .filter(p => p.completed && p.completedDate !== null)
      .map(p => new Date(p.completedDate as string).toDateString());

    const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    let currentDate = new Date();

    for (let date of uniqueDates) {
      if (new Date(date).toDateString() === currentDate.toDateString()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };


  const addDSAProblem = () => {
    if (newProblem.title.trim()) {
      setDsaProblems([...dsaProblems, {
        ...newProblem,
        id: Date.now(),
        completed: false,
        completedDate: null
      }]);
      setNewProblem({ title: '', difficulty: 'Medium', topic: '', source: 'SWE180' });
    }
  };

  const toggleDSAProblem = (id: number) => {
    setDsaProblems(dsaProblems.map(p =>
      p.id === id
        ? { ...p, completed: !p.completed, completedDate: !p.completed ? new Date().toISOString() : null }
        : p
    ));
  };

  const deleteDSAProblem = (id: number) => {
    setDsaProblems(dsaProblems.filter(p => p.id !== id));
  };

  const addRoutineTask = () => {
    if (newTask.trim()) {
      setRoutineTasks([...routineTasks, {
        id: Date.now(),
        title: newTask,
        completed: false
      }]);
      setNewTask('');
    }
  };

  const toggleRoutineTask = (id: number) => {
    setRoutineTasks(routineTasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteRoutineTask = (id: number) => {
    setRoutineTasks(routineTasks.filter(t => t.id !== id));
  };

  const addSDTopic = () => {
    if (newSDTopic.trim()) {
      setSystemDesignTopics([...systemDesignTopics, {
        id: Date.now(),
        title: newSDTopic,
        completed: false
      }]);
      setNewSDTopic('');
    }
  };

  const toggleSDTopic = (id: number) => {
    setSystemDesignTopics(systemDesignTopics.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteSDTopic = (id: number) => {
    setSystemDesignTopics(systemDesignTopics.filter(t => t.id !== id));
  };

  const getDifficultyColor = (difficulty: DSAProblem['difficulty']) => {
    const colors = {
      Easy: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || colors.Medium;
  };

  const getSourceColor = (source: DSAProblem['source']) => {
    const colors = {
      'SWE180': 'bg-blue-100 text-blue-800',
      'Striver A2Z': 'bg-purple-100 text-purple-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[source] || colors.Other;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">Java Backend Engineer → Product/Good Service Co.</h1>
                <p className="text-indigo-100 text-sm md:text-base">Oct 2023 Joinee | 60 Days Notice | NOT TCS/Wipro/Mass Recruiters 🎯💰</p>
              </div>
              <Briefcase className="w-10 h-10 md:w-12 md:h-12 opacity-50" />
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mt-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">{getCurrentPhase()}</span>
              </div>
            </div>
          </div>

          {/* Critical Timeline */}
          <div className="bg-gradient-to-r from-rose-50 to-orange-50 p-4 border-b-2 border-orange-300">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-orange-200">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                <div className="text-xl md:text-2xl font-bold text-orange-600">{daysToApply}</div>
                <div className="text-xs text-gray-600">Days to Apply</div>
                <div className="text-xs text-orange-600 font-medium mt-1">Mar 25, 2026</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-red-200">
                <Target className="w-5 h-5 mx-auto mb-1 text-red-600" />
                <div className="text-xl md:text-2xl font-bold text-red-600">{daysToOffer}</div>
                <div className="text-xs text-gray-600">Days to Offer</div>
                <div className="text-xs text-red-600 font-medium mt-1">May 1, 2026</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-green-200">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <div className="text-xl md:text-2xl font-bold text-green-600">{daysToJoin}</div>
                <div className="text-xs text-gray-600">Days to Join</div>
                <div className="text-xs text-green-600 font-medium mt-1">Jul 1, 2026</div>
              </div>
            </div>
          </div>

          {/* Detailed Timeline */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Your Battle Plan
            </h3>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500">
                <div className="font-semibold text-blue-700">Phase 1: Jan-Feb 2026 (8 weeks)</div>
                <div className="text-gray-600 mt-1">
                  ✓ Complete SWE180 Beginner Sheet in C++<br />
                  ✓ 3-4 problems/day | Use GPT for hints only<br />
                  ✓ Learn C++ STL basics as you go
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border-l-4 border-purple-500">
                <div className="font-semibold text-purple-700">Phase 2: Mar-Apr 2026 (8 weeks) - CRITICAL</div>
                <div className="text-gray-600 mt-1">
                  ✓ Striver A2Z: Arrays, Strings, Recursion, Binary Search, Sliding Window<br />
                  ✓ 3-4 problems/day + solid revisions (Product cos ask harder!)<br />
                  ✓ <span className="font-semibold text-orange-600">START APPLYING by Mar 25</span><br />
                  ✓ System Design: 2-3 topics/week (MUST for product companies)<br />
                  ✓ Polish resume: Highlight impact, not just tasks
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                <div className="font-semibold text-green-700">Phase 3: May-Jun 2026 (8 weeks) - Interview Sprint</div>
                <div className="text-gray-600 mt-1">
                  ✓ Striver A2Z: Trees, Graphs, DP (Medium level minimum)<br />
                  ✓ Mock interviews: Pramp, interviewing.io, peers<br />
                  ✓ LLD basics: Design patterns, SOLID principles<br />
                  ✓ Behavioral prep: STAR method, project stories<br />
                  ✓ Target offer by May 1 → Join July 1 (60 days notice)
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.solved}/{stats.total}</div>
              <div className="text-sm text-gray-600">Problems Solved</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
              <div className="text-sm text-gray-600">Day Streak 🔥</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-pink-600">
                {routineTasks.filter(t => t.completed).length}/{routineTasks.length}
              </div>
              <div className="text-sm text-gray-600">Daily Tasks</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dsa')}
              className={`flex-1 py-4 px-4 font-medium transition-colors text-sm whitespace-nowrap ${activeTab === 'dsa'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Code className="inline-block w-5 h-5 mr-2" />
              DSA Problems
            </button>
            <button
              onClick={() => setActiveTab('system-design')}
              className={`flex-1 py-4 px-4 font-medium transition-colors text-sm whitespace-nowrap ${activeTab === 'system-design'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Target className="inline-block w-5 h-5 mr-2" />
              System Design
            </button>
            <button
              onClick={() => setActiveTab('routine')}
              className={`flex-1 py-4 px-4 font-medium transition-colors text-sm whitespace-nowrap ${activeTab === 'routine'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <ListChecks className="inline-block w-5 h-5 mr-2" />
              Daily Routine
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'dsa' ? (
              <div>
                {/* Bulk Import from SWE180 */}
                <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Import Problems from SWE180 Sheet
                  </div>
                  <div className="text-blue-700 text-sm mb-3">
                    Current Progress: <span className="font-bold text-blue-900">27/141 (19%)</span> - Import remaining problems by topic
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        const matrixProblems = [
                          { title: "Spiral Matrix", topic: "Matrix", difficulty: "Medium" },
                        ];
                        matrixProblems.forEach((p, idx) => {
                          if (!dsaProblems.some(existing => existing.title === p.title)) {
                            setDsaProblems(prev => [...prev, {
                              ...p as Omit<DSAProblem, 'id' | 'completed' | 'completedDate' | 'source'>,
                              id: Date.now() + (idx * 1000),
                              source: 'SWE180',
                              completed: false,
                              completedDate: null
                            }]);
                          }
                        });
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Matrix (1)
                    </button>
                    <button
                      onClick={() => {
                        const sortingProblems = [
                          { title: "Bubble Sort", topic: "Sorting", difficulty: "Easy" },
                          { title: "Insertion Sort", topic: "Sorting", difficulty: "Easy" },
                          { title: "Selection Sort", topic: "Sorting", difficulty: "Easy" },
                        ];
                        sortingProblems.forEach((p, idx) => {
                          if (!dsaProblems.some(existing => existing.title === p.title)) {
                            setDsaProblems(prev => [...prev, {
                              ...p as Omit<DSAProblem, 'id' | 'completed' | 'completedDate' | 'source'>,
                              id: Date.now() + (idx * 1000),
                              source: 'SWE180',
                              completed: false,
                              completedDate: null
                            }]);
                          }
                        });
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Sorting (3)
                    </button>
                    <button
                      onClick={() => {
                        const llProblems = [
                          { title: "Insert in Middle of LL", topic: "Linked List", difficulty: "Easy" },
                          { title: "Insert at End of LL", topic: "Linked List", difficulty: "Easy" },
                          { title: "Insert in Sorted List", topic: "Linked List", difficulty: "Easy" },
                          { title: "Delete Node from LL", topic: "Linked List", difficulty: "Easy" },
                          { title: "Reverse Linked List", topic: "Linked List", difficulty: "Easy" },
                          { title: "Detect Loop in LL", topic: "Linked List", difficulty: "Medium" },
                          { title: "Find Middle of LL", topic: "Linked List", difficulty: "Easy" },
                          { title: "Merge Two Sorted LL", topic: "Linked List", difficulty: "Easy" },
                        ];
                        llProblems.forEach((p, idx) => {
                          if (!dsaProblems.some(existing => existing.title === p.title)) {
                            setDsaProblems(prev => [...prev, {
                              ...p as Omit<DSAProblem, 'id' | 'completed' | 'completedDate' | 'source'>,
                              id: Date.now() + (idx * 1000),
                              source: 'SWE180',
                              completed: false,
                              completedDate: null
                            }]);
                          }
                        });
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Linked List (8)
                    </button>
                    <button
                      onClick={() => {
                        const dllProblems = [
                          { title: "DLL Insert at Beginning", topic: "Doubly LL", difficulty: "Easy" },
                          { title: "DLL Insert at End", topic: "Doubly LL", difficulty: "Easy" },
                          { title: "DLL Delete Node", topic: "Doubly LL", difficulty: "Easy" },
                          { title: "DLL Reverse", topic: "Doubly LL", difficulty: "Medium" },
                        ];
                        dllProblems.forEach((p, idx) => {
                          if (!dsaProblems.some(existing => existing.title === p.title)) {
                            setDsaProblems(prev => [...prev, {
                              ...p as Omit<DSAProblem, 'id' | 'completed' | 'completedDate' | 'source'>,
                              id: Date.now() + (idx * 1000),
                              source: 'SWE180',
                              completed: false,
                              completedDate: null
                            }]);
                          }
                        });
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Doubly LL (4)
                    </button>
                    <button
                      onClick={() => {
                        const stackProblems = [
                          { title: "Implement Stack", topic: "Stack", difficulty: "Easy" },
                          { title: "Valid Parentheses", topic: "Stack", difficulty: "Easy" },
                          { title: "Min Stack", topic: "Stack", difficulty: "Medium" },
                          { title: "Next Greater Element", topic: "Stack", difficulty: "Medium" },
                        ];
                        stackProblems.forEach((p, idx) => {
                          if (!dsaProblems.some(existing => existing.title === p.title)) {
                            setDsaProblems(prev => [...prev, {
                              ...p as Omit<DSAProblem, 'id' | 'completed' | 'completedDate' | 'source'>,
                              id: Date.now() + (idx * 1000),
                              source: 'SWE180',
                              completed: false,
                              completedDate: null
                            }]);
                          }
                        });
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Stack (4)
                    </button>
                    <button
                      onClick={() => {
                        const queueProblems = [
                          { title: "Implement Queue", topic: "Queue", difficulty: "Easy" },
                          { title: "Queue using Stacks", topic: "Queue", difficulty: "Easy" },
                          { title: "Circular Queue", topic: "Queue", difficulty: "Medium" },
                          { title: "First Non-Repeating Char", topic: "Queue", difficulty: "Medium" },
                        ];
                        queueProblems.forEach((p, idx) => {
                          if (!dsaProblems.some(existing => existing.title === p.title)) {
                            setDsaProblems(prev => [...prev, {
                              ...p as Omit<DSAProblem, 'id' | 'completed' | 'completedDate' | 'source'>,
                              id: Date.now() + (idx * 1000),
                              source: 'SWE180',
                              completed: false,
                              completedDate: null
                            }]);
                          }
                        });
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Queue (4)
                    </button>
                    <button
                      onClick={() => {
                        const recursionProblems = [
                          { title: "Factorial", topic: "Recursion", difficulty: "Easy" },
                          { title: "Fibonacci", topic: "Recursion", difficulty: "Easy" },
                          { title: "Power of N", topic: "Recursion", difficulty: "Easy" },
                          { title: "Print N to 1", topic: "Recursion", difficulty: "Easy" },
                          { title: "Sum of Digits", topic: "Recursion", difficulty: "Easy" },
                          { title: "Tower of Hanoi", topic: "Recursion", difficulty: "Medium" },
                        ];
                        recursionProblems.forEach((p, idx) => {
                          if (!dsaProblems.some(existing => existing.title === p.title)) {
                            setDsaProblems(prev => [...prev, {
                              ...p as Omit<DSAProblem, 'id' | 'completed' | 'completedDate' | 'source'>,
                              id: Date.now() + (idx * 1000),
                              source: 'SWE180',
                              completed: false,
                              completedDate: null
                            }]);
                          }
                        });
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Recursion (6)
                    </button>
                    <button
                      onClick={() => {
                        const bitProblems = [
                          { title: "Count Set Bits", topic: "Bit Manipulation", difficulty: "Easy" },
                          { title: "Power of Two", topic: "Bit Manipulation", difficulty: "Easy" },
                          { title: "Check if Kth Bit Set", topic: "Bit Manipulation", difficulty: "Easy" },
                          { title: "XOR of Numbers", topic: "Bit Manipulation", difficulty: "Easy" },
                        ];
                        bitProblems.forEach((p, idx) => {
                          if (!dsaProblems.some(existing => existing.title === p.title)) {
                            setDsaProblems(prev => [...prev, {
                              ...p as Omit<DSAProblem, 'id' | 'completed' | 'completedDate' | 'source'>,
                              id: Date.now() + (idx * 1000),
                              source: 'SWE180',
                              completed: false,
                              completedDate: null
                            }]);
                          }
                        });
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Bit Manipulation (4)
                    </button>
                    <button
                      onClick={() => {
                        const heapProblems = [
                          { title: "Kth Largest Element", topic: "Heap", difficulty: "Medium" },
                          { title: "Merge K Sorted Arrays", topic: "Heap", difficulty: "Medium" },
                          { title: "Top K Frequent", topic: "Heap", difficulty: "Medium" },
                        ];
                        heapProblems.forEach((p, idx) => {
                          if (!dsaProblems.some(existing => existing.title === p.title)) {
                            setDsaProblems(prev => [...prev, {
                              ...p as Omit<DSAProblem, 'id' | 'completed' | 'completedDate' | 'source'>,
                              id: Date.now() + (idx * 1000),
                              source: 'SWE180',
                              completed: false,
                              completedDate: null
                            }]);
                          }
                        });
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Heap (3)
                    </button>
                    <button
                      onClick={() => {
                        const hashProblems = [
                          { title: "Two Sum", topic: "Hashing", difficulty: "Easy" },
                          { title: "First Repeating Element", topic: "Hashing", difficulty: "Easy" },
                          { title: "Count Distinct", topic: "Hashing", difficulty: "Easy" },
                          { title: "Subarray with Sum 0", topic: "Hashing", difficulty: "Medium" },
                        ];
                        hashProblems.forEach((p, idx) => {
                          if (!dsaProblems.some(existing => existing.title === p.title)) {
                            setDsaProblems(prev => [...prev, {
                              ...p as Omit<DSAProblem, 'id' | 'completed' | 'completedDate' | 'source'>,
                              id: Date.now() + (idx * 1000),
                              source: 'SWE180',
                              completed: false,
                              completedDate: null
                            }]);
                          }
                        });
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Hashing (4)
                    </button>
                    <button
                      onClick={() => {
                        const treeProblems = [
                          { title: "Binary Tree Traversals", topic: "Tree", difficulty: "Easy" },
                          { title: "Height of Tree", topic: "Tree", difficulty: "Easy" },
                          { title: "Level Order Traversal", topic: "Tree", difficulty: "Medium" },
                          { title: "Diameter of Tree", topic: "Tree", difficulty: "Medium" },
                        ];
                        treeProblems.forEach((p, idx) => {
                          if (!dsaProblems.some(existing => existing.title === p.title)) {
                            setDsaProblems(prev => [...prev, {
                              ...p as Omit<DSAProblem, 'id' | 'completed' | 'completedDate' | 'source'>,
                              id: Date.now() + (idx * 1000),
                              source: 'SWE180',
                              completed: false,
                              completedDate: null
                            }]);
                          }
                        });
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Tree (4)
                    </button>
                    <button
                      onClick={() => {
                        const allRemaining = [
                          // Matrix
                          { title: "Spiral Matrix", topic: "Matrix", difficulty: "Medium" },
                          // Sorting
                          { title: "Bubble Sort", topic: "Sorting", difficulty: "Easy" },
                          { title: "Insertion Sort", topic: "Sorting", difficulty: "Easy" },
                          { title: "Selection Sort", topic: "Sorting", difficulty: "Easy" },
                          // Linked List
                          { title: "Insert in Middle of LL", topic: "Linked List", difficulty: "Easy" },
                          { title: "Insert at End of LL", topic: "Linked List", difficulty: "Easy" },
                          { title: "Insert in Sorted List", topic: "Linked List", difficulty: "Easy" },
                          { title: "Delete Node from LL", topic: "Linked List", difficulty: "Easy" },
                          { title: "Reverse Linked List", topic: "Linked List", difficulty: "Easy" },
                          { title: "Detect Loop in LL", topic: "Linked List", difficulty: "Medium" },
                          { title: "Find Middle of LL", topic: "Linked List", difficulty: "Easy" },
                          { title: "Merge Two Sorted LL", topic: "Linked List", difficulty: "Easy" },
                        ];
                        allRemaining.forEach((p, idx) => {
                          if (!dsaProblems.some(existing => existing.title === p.title)) {
                            setDsaProblems(prev => [...prev, {
                              ...p as Omit<DSAProblem, 'id' | 'completed' | 'completedDate' | 'source'>,
                              id: Date.now() + (idx * 1000),
                              source: 'SWE180',
                              completed: false,
                              completedDate: null
                            }]);
                          }
                        });
                      }}
                      className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors col-span-2 md:col-span-3 font-semibold"
                    >
                      ⚡ Import All Remaining (114 problems)
                    </button>
                  </div>
                </div>

                {/* Add Problem Form */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <input
                      type="text"
                      placeholder="Problem title"
                      value={newProblem.title}
                      onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && addDSAProblem()}
                      className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Topic (Arrays, DP...)"
                      value={newProblem.topic}
                      onChange={(e) => setNewProblem({ ...newProblem, topic: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && addDSAProblem()}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                      value={newProblem.difficulty}
                      onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard'})}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                    <select
                      value={newProblem.source}
                      onChange={(e) => setNewProblem({ ...newProblem, source: e.target.value as'SWE180' | 'Striver A2Z' | 'Other' })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>SWE180</option>
                      <option>Striver A2Z</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <button
                    onClick={addDSAProblem}
                    className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Problem
                  </button>
                </div>

                {/* GPT Usage Reminder */}
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                  <div className="font-semibold text-blue-800 mb-1">💡 GPT Strategy (Your Current Approach ✓)</div>
                  <div className="text-blue-700">
                    1. Struggle for 30-40 min first<br />
                    2. Ask GPT for hints/approach only<br />
                    3. Request code only when exhausted<br />
                    4. Learn C++ STL syntax as needed
                  </div>
                </div>

                {/* Problems List */}
                <div className="space-y-2">
                  {dsaProblems.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-2">No problems added yet. Start with SWE180!</p>
                      <a
                        href="https://www.swe180.com/dsa-beginner-sheet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 mt-2"
                      >
                        → Open SWE180 Beginner Sheet
                      </a>
                    </div>
                  ) : (
                    dsaProblems.map(problem => (
                      <div
                        key={problem.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${problem.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-indigo-300'
                          }`}
                      >
                        <button
                          onClick={() => toggleDSAProblem(problem.id)}
                          className="flex-shrink-0"
                        >
                          {problem.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                        <div className="flex-grow min-w-0">
                          <div className={`font-medium ${problem.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {problem.title}
                          </div>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded ${getSourceColor(problem.source)}`}>
                              {problem.source}
                            </span>
                            {problem.topic && (
                              <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded">
                                {problem.topic}
                              </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteDSAProblem(problem.id)}
                          className="flex-shrink-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : activeTab === 'system-design' ? (
              <div>
                {/* Add SD Topic Form */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg flex gap-3">
                  <input
                    type="text"
                    placeholder="Add System Design topic"
                    value={newSDTopic}
                    onChange={(e) => setNewSDTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSDTopic()}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={addSDTopic}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add
                  </button>
                </div>

                {/* SD Learning Path */}
                <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm">
                  <div className="font-semibold text-purple-800 mb-2">🎯 System Design Learning Path</div>
                  <div className="space-y-2 text-purple-700">
                    <div><strong>Mar-Apr:</strong> Scalability, Load Balancing, Caching, DB fundamentals</div>
                    <div><strong>May-Jun:</strong> CAP theorem, Sharding, Message Queues, Microservices</div>
                    <div><strong>Resources:</strong> Gaurav Sen (YouTube), System Design Primer (GitHub)</div>
                  </div>
                </div>

                {/* SD Topics List */}
                <div className="space-y-2">
                  {systemDesignTopics.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Start adding System Design topics from Mar 2026</p>
                      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg space-y-1">
                        <p className="font-medium">Quick Start Topics:</p>
                        <p>• Scalability Basics • Load Balancing • Caching Strategies</p>
                        <p>• SQL vs NoSQL • Database Sharding • CAP Theorem</p>
                        <p>• Rate Limiting • API Gateway • Microservices</p>
                      </div>
                    </div>
                  ) : (
                    systemDesignTopics.map(topic => (
                      <div
                        key={topic.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${topic.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-indigo-300'
                          }`}
                      >
                        <button
                          onClick={() => toggleSDTopic(topic.id)}
                          className="flex-shrink-0"
                        >
                          {topic.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                        <div className={`flex-grow font-medium ${topic.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {topic.title}
                        </div>
                        <button
                          onClick={() => deleteSDTopic(topic.id)}
                          className="flex-shrink-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div>
                {/* Add Task Form */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg flex gap-3">
                  <input
                    type="text"
                    placeholder="Add daily routine task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addRoutineTask()}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={addRoutineTask}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add
                  </button>
                </div>

                {/* Tasks List */}
                <div className="space-y-2">
                  {routineTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Build your daily habits!</p>
                      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg space-y-1">
                        <p className="font-medium">Suggested Daily Tasks:</p>
                        <p>• Solve 3-4 DSA problems (SWE180 phase)</p>
                        <p>• Learn 1 new C++ STL function/concept</p>
                        <p>• Code review at work (Java/Spring Boot)</p>
                        <p>• 30 min system design reading (Mar onwards)</p>
                      </div>
                    </div>
                  ) : (
                    routineTasks.map(task => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${task.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-indigo-300'
                          }`}
                      >
                        <button
                          onClick={() => toggleRoutineTask(task.id)}
                          className="flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                        <div className={`flex-grow font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </div>
                        <button
                          onClick={() => deleteRoutineTask(task.id)}
                          className="flex-shrink-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}