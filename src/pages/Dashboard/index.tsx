import React, { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '../../services/api';
import { Title, Form, Repos, Error } from './styles';
import { FiChevronRight } from 'react-icons/fi';

import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';

interface GithubRepository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export const Dashboard: React.FC = () => {
  const [repos, setRepos] = useState<GithubRepository[]>(() => {
    const storageRepos = localStorage.getItem('@GitCollections:repositories');
    if (storageRepos) {
      return JSON.parse(storageRepos);
    }
  });
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const formEl = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    localStorage.setItem('@GitCollections:repositories', JSON.stringify(repos));
  }, [repos]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setNewRepo(event.target.value),
    [],
  );

  async function handleAddRepo(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!newRepo) {
      setInputError('Informe o username/repositório');
      return;
    }

    try {
      const response = await api.get<GithubRepository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepos([...repos, repository]);
      formEl.current?.reset();
      setNewRepo('');
    } catch (error) {
      setInputError('Repositório não encontrado no Github');
    }
  }
  return (
    <>
      <img src={logo} alt="GitCollection" />
      <Title>Catálogos de repositórios do GitHub</Title>

      <Form
        ref={formEl}
        hasError={Boolean(inputError)}
        onSubmit={handleAddRepo}
      >
        <input
          placeholder="username/repository_name"
          onChange={handleInputChange}
        />
        <button type="submit">Buscar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repos>
        {repos.map((repository, index) => (
          <Link
            key={repository.full_name + index}
            to={`repositories/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight />
          </Link>
        ))}
      </Repos>
    </>
  );
};
