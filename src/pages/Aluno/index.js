import React, { useState, useContext, useEffect } from 'react';
import { ThemeSwitcher } from '../../context/ThemeSwitcher';
import { Form, Input, Select } from '@rocketseat/unform';
import * as Yup from 'yup';

import { AiFillExclamationCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { cpf } from 'cpf-cnpj-validator';

import axios from 'axios';
import api from '../../services/api';

import Header from '../../components/Header';

import { Container, Title, Content } from './styles';

// Validações
const schema = Yup.object().shape({
  nome: Yup.string().required('O nome do candidato é obrigatório'),
  email: Yup.string().email('Insira um e-mail, válido'),
  cpf: Yup.string()
    .max(11)
    .required('O CPF é obrigátorio'),
  rg: Yup.string()
    .max(14)
    .required('O RG é obrigatório'),
  telefone: Yup.string()
    .max(11)
    .required('O telefone é obrigatório'),
  data_nasc: Yup.string().required('Informe a data de nascimento'),
  sexo: Yup.string().required('Informe o sexo'),
  nome_pai: Yup.string(),
  nome_mae: Yup.string(),
  endereco: Yup.string().required('A rua é obrigatória'),
  bairro: Yup.string().required('O bairro é obrigatório'),
  cidade: Yup.string().required('A cidade é obrigatória'),
  uf: Yup.string().required('O estado é obrigatório'),
  categoria: Yup.string().required('A categoria é obrigatória'),
  instrutor_id: Yup.string().required('Informe o instrutor'),
  veiculo_id: Yup.string().required('Informe o veículo'),
  data_matric: Yup.string().required('A data de matrícula é obrigatória'),
  profissao: Yup.string(),
  local_trab: Yup.string(),
  ativo: Yup.string().required('Informe o status do candidato'),
});

export default function Aluno() {
  const theme = useContext(ThemeSwitcher);
  // Recebe os dados do useEffect
  const [instrutores, setInstrutores] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [ufs, setUfs] = useState([]);
  const [citys, setCitys] = useState([{ id: '0', title: 'Cidade' }]);
  const [selectedUf, setSelectedUf] = useState('');

  // Quando o componente for montado, busca instrutores e veiculos para os selects
  useEffect(() => {
    api
      .get('/instrutores')
      .then(res => {
        const instrutoresTitle = res.data.map(instrutor => ({
          ...instrutor,
          title: instrutor.nome,
        }));
        setInstrutores(instrutoresTitle);
      })
      .catch(error => {
        setInstrutores([]);
      });

    api
      .get('/veiculos')
      .then(res => {
        const veiculosTitle = res.data.map(veiculo => ({
          ...veiculo,
          title: veiculo.placa,
        }));
        setVeiculos(veiculosTitle);
      })
      .catch(error => setVeiculos([]));
  }, []);

  // Buscando estados do IBGE
  useEffect(() => {
    axios
      .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufNames = response.data.map(uf => ({
          id: uf.sigla,
          title: uf.sigla,
        }));
        setUfs(ufNames);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then(response => {
        const cityNames = response.data.map(city => ({
          id: city.nome,
          title: city.nome,
        }));
        setCitys(cityNames);
      });
  }, [selectedUf]);

  function handleSelectUf(uf) {
    setSelectedUf(uf);
  }

  // Atribuindo titulo para usar nos Selects

  const sexo = [
    { id: 'Masculino', title: 'Masculino' },
    { id: 'Feminino', title: 'Feminino' },
    { id: 'Outro', title: 'Outro' },
  ];

  const categoria = [
    { id: 'A', title: 'A' },
    { id: 'B', title: 'B' },
    { id: 'C', title: 'C' },
    { id: 'D', title: 'D' },
    { id: 'E', title: 'E' },
  ];

  const ativo = [
    { id: '1', title: 'Ativo' },
    { id: '0', title: 'Inativo' },
  ];

  function handleSubmit(data) {
    if (cpf.isValid(data.cpf)) {
      api
        .get(`/alunos/${data.cpf}`)
        .then(res => toast.error('O aluno já está cadastrado'))
        .catch(error => {
          api
            .post(`/alunos`, data)
            .then(toast.success('Aluno cadastrado com sucesso'))
            .catch(error => {
              'Erro ao realizar o cadastro, confira os dados';
            });
        });
    } else {
      toast.error('Erro ao realizar o cadastro, insira um CPF válido');
    }
  }

  return (
    <Container theme={theme.theme}>
      <Header />
      <Content theme={theme.theme}>
        <Title theme={theme.theme}>
          <AiFillExclamationCircle />
          <h1>Cadastro de alunos</h1>
        </Title>
        <Form onSubmit={handleSubmit} schema={schema}>
          <h5>Dados pessoais</h5>
          <div className="alinhador-content">
            <div className="alinhador">
              <Input
                autoComplete="off"
                type="text"
                name="nome"
                placeholder="Nome completo"
              />

              <Input
                autoComplete="off"
                type="text"
                name="cpf"
                placeholder="CPF (apenas números)"
                maxLength={11}
              />

              <Input
                autoComplete="off"
                type="text"
                name="rg"
                placeholder="RG"
                maxLength={14}
              />
            </div>

            <div className="alinhador">
              <Input
                autoComplete="off"
                type="email"
                name="email"
                placeholder="E-mail"
              />

              <Input
                autoComplete="off"
                type="text"
                name="telefone"
                placeholder="Telefone"
                maxLength={11}
              />

              <Input
                autoComplete="off"
                type="date"
                title="Data"
                name="data_nasc"
              />
            </div>

            <div className="alinhador">
              <Select
                autoComplete="off"
                placeholder="Sexo"
                name="sexo"
                options={sexo}
              />

              <Input
                autoComplete="off"
                type="text"
                name="nome_pai"
                placeholder="Nome do pai"
              />

              <Input
                autoComplete="off"
                type="text"
                name="nome_mae"
                placeholder="Nome da mãe"
              />
            </div>
          </div>

          <h5>Endereço</h5>
          <div className="alinhador-content">
            <div className="alinhador">
              <Input
                autoComplete="off"
                type="text"
                name="endereco"
                placeholder="Rua"
              />
            </div>

            <div className="alinhador">
              <Input
                autoComplete="off"
                type="text"
                name="bairro"
                placeholder="Bairro"
              />
            </div>

            <div className="alinhador">
              <Select
                autoComplete="off"
                placeholder="Estado"
                onChange={e => {
                  handleSelectUf(e.target.value);
                }}
                name="uf"
                options={ufs}
              />
            </div>

            <div className="alinhador">
              <Select
                autoComplete="off"
                placeholder="Cidade"
                name="cidade"
                options={citys}
              />
            </div>
          </div>
          <h5>Informações adicionais</h5>
          <div className="alinhador-content">
            <div className="alinhador">
              <p>Categoria</p>
              <Select
                autoComplete="off"
                placeholder="categoria"
                name="categoria"
                options={categoria}
              />
            </div>
            <div className="alinhador">
              <p>Instrutor</p>
              <Select
                autoComplete="off"
                placeholder="Instrutor"
                name="instrutor_id"
                options={instrutores}
              />
            </div>
            <div className="alinhador">
              <p>Veículo</p>
              <Select
                autoComplete="off"
                placeholder="Veículo"
                name="veiculo_id"
                options={veiculos}
              />
            </div>
            <div className="alinhador">
              <p>Data de matrícula:</p>
              <Input
                autoComplete="off"
                type="date"
                name="data_matric"
                placeholder="Data de matrícula"
              />
            </div>
          </div>
          <div>
            <h5>Informações profissionais</h5>
            <Input
              autoComplete="off"
              type="text"
              name="profissao"
              placeholder="Profissão"
            />
            <Input
              autoComplete="off"
              type="text"
              name="local_trab"
              placeholder="Local de trabalho"
            />
          </div>
          <p id="status">Status:</p>
          <Select
            autoComplete="off"
            placeholder="Status"
            name="ativo"
            options={ativo}
          />
          <button type="submit">Salvar</button>
        </Form>
      </Content>
    </Container>
  );
}
