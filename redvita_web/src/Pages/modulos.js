import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { Form, Button, Container } from 'react-bootstrap';
import '../styles/EducationalModule.css'; 
import Header from '../components/Header';

const EducationalModule = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'modules'), {
                question: question,
                answer: answer
            });
            alert('Módulo educativo subido exitosamente');
            setQuestion('');
            setAnswer('');
        } catch (e) {
            console.error('Error al añadir documento: ', e);
            alert('Error al subir el módulo educativo. Inténtalo de nuevo.');
        }
    };

    return (
        <Container className="module-container mt-navbar">
            <Header />
    <h2 className="module-title">Subir Módulo Educativo</h2>
    <Form onSubmit={handleSubmit} className="module-form">
        
                <Form.Group className="mb-3" controlId="question">
                    <Form.Label>Pregunta</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Escribe la pregunta aquí..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="answer">
                    <Form.Label>Respuesta</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Escribe la respuesta aquí..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="danger" type="submit" className="module-button">
                    Subir Módulo
                </Button>
            </Form>
        </Container>
    );
};

export default EducationalModule;
