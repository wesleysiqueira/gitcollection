import React, { useCallback, useEffect, useState } from 'react';

import { api } from '../../services/api';
import { Title, Form, Repos, Error } from './styles';
import { FiChevronRight } from 'react-icons/fi';

import logo from '../../assets/logo.svg';

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
    if (!inputError) {
      setInputError('Informe o username/repositório');
      return;
    }
    const response = await api.get<GithubRepository>(`repos/${newRepo}`);

    const repository = response.data;

    setRepos([...repos, repository]);
    setNewRepo('');
  }
  return (
    <>
      <img src={logo} alt="GitCollection" />
      <Title>Catálogos de repositórios do GitHub</Title>

      <Form hasError={Boolean(inputError)} onSubmit={handleAddRepo}>
        <input
          placeholder="username/repository_name"
          onChange={handleInputChange}
        />
        <button type="submit">Buscar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repos>
        {repos.map(repository => (
          <a href="/repositories" key={repository.full_name}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight />
          </a>
        ))}
      </Repos>
    </>
  );
};
