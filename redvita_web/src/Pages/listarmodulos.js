import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Importa la configuración de Firebase
import { collection, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { Button, Container, Table, Form } from 'react-bootstrap';
import Header from '../components/Header';

const ListEducationalModules = () => {
    const [modules, setModules] = useState([]);
    const [editId, setEditId] = useState(null);
    const [updatedQuestion, setUpdatedQuestion] = useState('');
    const [updatedAnswer, setUpdatedAnswer] = useState('');

    // Obtener los módulos educativos al cargar el componente
    useEffect(() => {
        const fetchModules = async () => {
            const querySnapshot = await getDocs(collection(db, 'modules'));
            const modulesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setModules(modulesData);
        };
        fetchModules();
    }, []);

    // Manejar la eliminación de un módulo
    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'modules', id));
        setModules(modules.filter((module) => module.id !== id));
    };

    // Manejar la edición de un módulo
    const handleEdit = (module) => {
        setEditId(module.id);
        setUpdatedQuestion(module.question);
        setUpdatedAnswer(module.answer);
    };

    // Manejar la actualización de un módulo
    const handleUpdate = async (id) => {
        const moduleRef = doc(db, 'modules', id);
        await updateDoc(moduleRef, {
            question: updatedQuestion,
            answer: updatedAnswer,
        });

        setModules(modules.map((module) =>
            module.id === id ? { ...module, question: updatedQuestion, answer: updatedAnswer } : module
        ));
        setEditId(null);
        setUpdatedQuestion('');
        setUpdatedAnswer('');
    };

    return (
        <Container className="mt-navbar">
            <Header />
            <h2 className="module-title">Listado de Módulos Educativos</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Pregunta</th>
                        <th>Respuesta</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {modules.map((module) => (
                        <tr key={module.id}>
                            <td>
                                {editId === module.id ? (
                                    <Form.Control
                                        type="text"
                                        value={updatedQuestion}
                                        onChange={(e) => setUpdatedQuestion(e.target.value)}
                                    />
                                ) : (
                                    module.question
                                )}
                            </td>
                            <td>
                                {editId === module.id ? (
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={updatedAnswer}
                                        onChange={(e) => setUpdatedAnswer(e.target.value)}
                                    />
                                ) : (
                                    module.answer
                                )}
                            </td>
                            <td>
                                {editId === module.id ? (
                                    <>
                                        <Button
                                            variant="success"
                                            onClick={() => handleUpdate(module.id)}
                                            className="me-2"
                                        >
                                            Guardar
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => setEditId(null)}
                                        >
                                            Cancelar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="warning"
                                            onClick={() => handleEdit(module)}
                                            className="me-2"
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(module.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ListEducationalModules;
