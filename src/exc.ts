interface Student {
  id: number,
  name: string,
  age: number,
  grade: string,
}

let students: Student[] = [
  { id: 2, name: 'A', age: 14, grade: 'A' },
  { id: 3, name: 'B', age: 14, grade: 'B' },
  { id: 4, name: 'C', age: 14, grade: 'C' },
];

function listStudent(): void {
  for (const student of students) {
    console.log(`ID: ${student.id}, Name: ${student.name}, Age: ${student.age}, Grade: ${student.grade}`);
  }
}


function addStudent(a: Student): void {
  students.push(a);
}

function deleteStudent(id: number): void {
  const StudentFound = students.find((student) => student.id === id);
  if (!StudentFound) console.log("ID not found");
  students = students.filter((student) => student.id !== id);
}