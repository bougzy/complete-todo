import  { useState, useContext, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Container, Row, Col, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { ThemeContext } from './ThemeContext';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');
    const [filterCompleted, setFilterCompleted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState('');
    const [showTotalTasks, setShowTotalTasks] = useState(false);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification('');
      }, 2000);
    }
  }, [notification]);

  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObj = {
        id: uuid(),
        text: newTask,
        completed: false,
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
      setNotification('Task added successfully!');
    }
  };

  const markTaskCompleted = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task))
    );
    setNotification('Task marked as completed!');
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setNotification('Task deleted successfully!');
  };

  const startEditingTask = (taskId, taskText) => {
    setEditTaskId(taskId);
    setEditTaskText(taskText);
  };

  const cancelEditingTask = () => {
    setEditTaskId(null);
    setEditTaskText('');
  };

  const updateTask = (taskId) => {
    if (editTaskText.trim() !== '') {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, text: editTaskText } : task
        )
      );
      setEditTaskId(null);
      setEditTaskText('');
      setNotification('Task updated successfully!');
    }
  };

  const toggleFilterCompleted = () => {
    setFilterCompleted(!filterCompleted);
  };

  const clearCompletedTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
    setNotification('Completed tasks cleared successfully!');
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  const handleTotalTasksClick = () => {
    setShowTotalTasks(!showTotalTasks);
  };

  const handleCompletedTasksClick = () => {
    setShowCompletedTasks(!showCompletedTasks);
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}> 
      <Container>
    <button onClick={toggleTheme} className="text-center d-flex p-3 mt-4 border-0 shadow-sm fw-bold rounded">Toggle Theme</button>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h1 className="text-center mt-4">Todo List</h1>
          <Form className="mt-4">
            <Row>
              <Col xs={9}>
                <Form.Control
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task"
                />
              </Col>
              <Col xs={3}>
                <Button variant="primary" onClick={addTask} block>
                  Add Task
                </Button>
              </Col>
            </Row>
          </Form>
          <div className="mt-4 text-center">
            <Form.Check
              type="checkbox"
              checked={filterCompleted}
              onChange={toggleFilterCompleted}
              label="Show Completed Tasks"
            />
          </div>
          <div className="mt-4 text-center">
            <Badge
              variant="secondary"
              className="mr-2"
              onClick={handleTotalTasksClick}
              style={{ cursor: 'pointer' }}
            >
              Total Tasks: {totalTasks}
            </Badge>
            {showTotalTasks && (
              <div>
                {/* Render additional content related to total tasks here */}
              </div>
            )}
            <Badge
              variant="success"
              onClick={handleCompletedTasksClick}
              style={{ cursor: 'pointer' }}
            >
              Completed Tasks: {completedTasks}
            </Badge>
            {showCompletedTasks && (
              <div>
                {/* Render additional content related to completed tasks here */}
              </div>
            )}
          </div>
          <Form.Control
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            className="mt-4"
          />
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <ListGroup {...provided.droppableProps} ref={provided.innerRef} className="mt-4">
                  {filteredTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <ListGroup.Item
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            textDecoration: task.completed ? 'line-through' : 'none',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            {editTaskId === task.id ? (
                              <Form.Control
                                type="text"
                                value={editTaskText}
                                onChange={(e) => setEditTaskText(e.target.value)}
                                className="mr-2"
                              />
                            ) : (
                              <div>{task.text}</div>
                            )}
                            {editTaskId === task.id ? (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => updateTask(task.id)}
                                  className="mr-2"
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={cancelEditingTask}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                {!task.completed && (
                                  <>
                                    <Button
                                      variant="success"
                                      size="sm"
                                      onClick={() => markTaskCompleted(task.id)}
                                      className="mr-2"
                                    >
                                      Mark Completed
                                    </Button>
                                    <Button
                                      variant="warning"
                                      size="sm"
                                      onClick={() => startEditingTask(task.id, task.text)}
                                      className="mr-2"
                                    >
                                      Edit
                                    </Button>
                                  </>
                                )}
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => deleteTask(task.id)}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </ListGroup.Item>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ListGroup>
              )}
            </Droppable>
          </DragDropContext>
          <div className="mt-4 text-center">
            <Button variant="danger" onClick={clearCompletedTasks}>
              Clear Completed Tasks
            </Button>
          </div>
          {notification && <p className="text-center mt-4">{notification}</p>}
        </Col>
      </Row>
    </Container>
    </div>  
  );
};

export default TodoList;
