import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseForm = ({ course, onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [info, setInfo] = useState('');
  const [costo, setCosto] = useState('');
  const [vigencia, setVigencia] = useState('');
  const [cupo, setCupo] = useState('');

  useEffect(() => {
    if (course) {
      setNombre(course.nombre);
      setInfo(course.info);
      setCost(course.costo);
      setVigencia(course.vigencia);
      setCupo(course.cupo);
    } else {
      setNombre('');
      setInfo('');
      setCosto('');
      setVigencia('');
      setCupo('');
    }
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (course) {
        await axios.put(`/cursos/${course.id}`, { nombre, info, costo, vigencia, cupo });
      } else {
        await axios.post('/cursos', { nombre, info, costo, vigencia, cupo });
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">{course ? 'Editar Curso' : 'Agregar Curso'}</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Info:
          <textarea
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-none"
            required
          />
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Costo:
          <textarea
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-none"
            required
          />
        </label>
      </div>
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {course ? 'Actualizar' : 'Agregar'}
      </button>
    </form>
  );
};

export default CourseForm;
