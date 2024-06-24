import { render, screen, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const button = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(button);

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(button);

  const tasks = screen.getAllByText(/History Test/i);
  expect(tasks.length).toBe(1);
});

test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const button = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";

  // Initially there should be no tasks
  let tasks = screen.queryAllByTestId('todo-task');
  expect(tasks.length).toBe(0);

  // Try to add a task without a name
  fireEvent.change(inputTask, { target: { value: "" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(button);

  // Verify that no new task was added
  tasks = screen.queryAllByTestId('todo-task');
  expect(tasks.length).toBe(0);
});

test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const button = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.click(button);

  const task = screen.queryByText(/History Test/i);
  expect(task).not.toBeInTheDocument();
});

test('test that App component can be deleted through checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const button = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(button);

  const task = screen.getByText(/History Test/i);
  expect(task).toBeInTheDocument();

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  const deletedTask = screen.queryByText(/History Test/i);
  expect(deletedTask).not.toBeInTheDocument();
});

test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const button = screen.getByRole('button', { name: /Add/i });
  const pastDueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: pastDueDate } });
  fireEvent.click(button);

  const taskCard = screen.getByTestId(/History Test/i).closest('.MuiPaper-root');
  expect(taskCard).toHaveStyle('background: red');
});