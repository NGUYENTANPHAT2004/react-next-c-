import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface ITodo {
  id: number | string;
  title: string;
  complete: boolean;
}

function App() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [editId, setEditId] = useState<number | string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/todo');
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleAddClick = async () => {
    if (newTodo.trim() !== '') {
      try {
        const response = await axios.post('http://localhost:3000/todo', {
          title: newTodo,
          complete: true,
        });
        setTodos([...todos, response.data]);
        setNewTodo('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleDelete = async (id: number | string) => {
    if (confirm("Are you sure you want to delete?")) {
      try {
        await axios.delete(`http://localhost:3000/todo/${id}`);
        const newTodos = todos.filter(todo => todo.id !== id);
        setTodos(newTodos);
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  // const handleChangeStatus = async (id: number | string) => {
  //   try {
  //     const todo = todos.find(todo => todo.id === id);
  //     if (todo) {
  //       const updatedTodo = { ...todo, complete: !todo.complete };
  //       await axios.put(`http://localhost:3000/todo/${id}`, updatedTodo);
  //       const newTodos = todos.map(todo => (todo.id === id ? updatedTodo : todo));
  //       setTodos(newTodos);
  //     }
  //   } catch (error) {
  //     console.error('Error updating status:', error);
  //   }
  // };

  const handleUpdateTodo = async (id: number | string) => {
    try {
      const updatedTodo = { ...todos.find(todo => todo.id === id), title: newTodo };
      await axios.put(`http://localhost:3000/todo/${id}`, updatedTodo);
      const newTodos = todos.map(todo => (todo.id === id ? updatedTodo : todo));
      setTodos(newTodos);
      setEditId(null);
      setNewTodo('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleEdit = (id: number | string, title: string) => {
    setEditId(id);
    setNewTodo(title);
  };

  return (
    <>
      <input type="text" value={newTodo} onChange={handleInputChange} />
      <button onClick={handleAddClick}>Thêm danh sách</button>
      <ul>
        {todos.map((todo: ITodo) => (
          editId === todo.id ? (
            <li key={todo.id}>
              <input
                type="text"
                value={newTodo}
                onChange={handleInputChange}
              />
              <button onClick={() => handleUpdateTodo(todo.id)}>Lưu</button>
              <button onClick={() => setEditId(null)}>Hủy</button>
            </li>
          ) : (
            <li key={todo.id}>
              {todo.title}
              <button onClick={() => handleEdit(todo.id, todo.title)}>Sửa</button>
              <button onClick={() => handleDelete(todo.id)}>Xóa</button>
            </li>
          )
        ))}
      </ul>
    </>
  );
}

export default App;
