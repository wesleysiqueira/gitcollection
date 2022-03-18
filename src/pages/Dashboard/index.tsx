import React from 'react';

import { Title, Form, Repos } from './styles';
import { FiChevronRight } from 'react-icons/fi';

import logo from '../../assets/logo.svg';

export const Dashboard: React.FC = () => {
  return (
    <>
      <img src={logo} alt="GitCollection" />
      <Title>Catálogos de repositórios do GitHub</Title>

      <Form>
        <input placeholder="username/repository_name" />
        <button type="submit">Buscar</button>
      </Form>

      <Repos>
        <a href="/repositories">
          <img
            src="https://avatars.githubusercontent.com/u/15800848?v=4"
            alt="Repositorio"
          />
          <div>
            <strong>wesleysiqueira/curso</strong>
            <p>Repositorio do Wesley</p>
          </div>
          <FiChevronRight />
        </a>
      </Repos>
    </>
  );
};
