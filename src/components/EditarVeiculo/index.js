import React, { useState, useContext, useEffect } from 'react';
import { ThemeSwitcher } from '../../context/ThemeSwitcher';
import { Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import { Form, Input } from '@rocketseat/unform';
import { toast } from 'react-toastify';
import { ModalStyled, ModalHeader, ModalBody, Button } from './styles';

import api from '../../services/api';

const schema = Yup.object().shape({
  placa: Yup.string().required('Informe a placa do veiculo'),
  cor: Yup.string().required('Informe a cor do veiculo'),
  modelo: Yup.string().required('Informe o modelo do veiculo'),
  ano: Yup.string().required('Informe o ano do veiculo'),
});

export default function EditarVeiculo({ show, handleClose, veiculo }) {
  const [placa, setPlaca] = useState('');
  const [cor, setCor] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const theme = useContext(ThemeSwitcher);

  useEffect(() => {
    setPlaca(veiculo.placa);
    setCor(veiculo.cor);
    setModelo(veiculo.modelo);
    setAno(veiculo.ano);
  }, [veiculo.ano, veiculo.cor, veiculo.modelo, veiculo.placa]);

  function handleSubmit(data) {
    api
      .put(`/veiculos/${veiculo.id}`, data)
      .then(res => {
        toast.success('Cadastro editato com sucesso');
      })
      .catch(res => {
        toast.error('Não foi possivel editar o cadastro');
      });
  }

  return (
    <ModalStyled show={show}>
      <ModalHeader>
        <h4>Editar cadastro</h4>
      </ModalHeader>
      <Modal.Body
        style={{
          background:
            theme.theme === 'dark'
              ? 'var(--darkBackground)'
              : 'var(--lightBackground)',
        }}
      >
        <ModalBody theme={theme.theme}>
          <Form onSubmit={handleSubmit} schema={schema}>
            <div className="alinhador">
              <p>Placa:</p>
              <Input
                value={placa}
                type="text"
                name="placa"
                placeholder="Placa"
                onChange={e => {
                  setPlaca(e.target.value);
                }}
              />
            </div>
            <div className="alinhador">
              <p>Cor:</p>
              <Input
                type="text"
                name="cor"
                placeholder="Cor"
                value={cor}
                onChange={e => {
                  setCor(e.target.value);
                }}
              />
            </div>
            <div className="alinhador">
              <p>Modelo:</p>
              <Input
                type="text"
                name="modelo"
                placeholder="Modelo"
                value={modelo}
                onChange={e => {
                  setModelo(e.target.value);
                }}
              />
            </div>
            <div className="alinhador">
              <p>Ano:</p>
              <Input
                type="text"
                name="ano"
                placeholder="Ano"
                value={ano}
                onChange={e => {
                  setAno(e.target.value);
                }}
              />
            </div>
            <Button type="submit" style={{ marginTop: '15px' }}>
              Salvar
            </Button>
            <Button close onClick={handleClose}>
              Fechar
            </Button>
          </Form>
        </ModalBody>
      </Modal.Body>
    </ModalStyled>
  );
}
