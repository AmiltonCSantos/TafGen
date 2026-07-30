import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import './Lista.css'

interface Tarefa {
  id: number;
  tarefa: string;
  status: string;
  prioridade: string;
  criadoEm: string;
}

function Lista() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Tarefa[]>([]);
    const [idSelecionado, setIdSelecionado] = useState<string | number | null>(null);
    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState("recentes")

    useEffect(() => {
        fetch("http://localhost:3001/tarefas")
            .then((resposta) => resposta.json())
            .then((dados) => setPosts(dados));
    }, []);

    function clique(id: string | number) {
        if (idSelecionado === id) {
            setIdSelecionado(null);
        } else {
            setIdSelecionado(id);
        }
    }

    function concluir(id: number, status: string) {
        const novoStatus = status === "pendente" ? "concluida" : "pendente";

        fetch(`http://localhost:3001/tarefas/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: novoStatus }),
        })
            .then((resposta) => {
                if (resposta.ok) {
                    setPosts(posts.map(post =>
                        post.id === id ? { ...post, status: novoStatus } : post
                    ));
                    setIdSelecionado(null);
                }
            })
            .catch((erro) => console.error("Erro ao concluir tarefa:", erro));
    }

    function excluir(id: number) {
        Swal.fire({
            title: 'Você tem certeza que deseja excluir sua tarefa?',
            text: "Você não poderá reverter essa ação!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:3001/tarefas/${id}`, { method: 'DELETE' })
                    .then((resposta) => {
                        if (resposta.ok) {
                            setPosts(posts.filter(post => post.id !== id));
                            setIdSelecionado(null);
                            Swal.fire('Excluído!', 'Sua tarefa foi deletada.', 'success');
                        }
                    });
            }
        });
    }

    const PrioridadeMap: { [prioridade: string]: number } = {
        "Urgente": 4,
        "Alta": 3, 
        "Media": 2,
        "Baixa": 1
    }   

    return (
        <div className="container">
            <div className="topo">
                <input
                    type="text"
                    id="pesquisar"
                    className="pesquisa"
                    placeholder="Pesquisar Tarefa"
                    onChange={(e) => setBusca(e.target.value)}
                />

                <Link to="/Cadastrar" className="botoes" style={{ textDecoration: 'none' }}>
                    Cadastrar nova tarefa
                </Link>
            </div>

            <div className="filtro">
                <label htmlFor="filtrar">Filtrar:</label>
                <select value={filtro} onChange={(e) => setFiltro(e.target.value)} id="filtrar">
                    <option value="alfabetica">Ordem Alfabetica</option>
                    <option value="recentes">Mais Recentes</option>
                    <option value="antigas">Mais Antigas</option>
                    <option value="prioridade">Prioridade</option>"
                </select>
            </div>
            
            <div className="quadrodetarefas">
                <div id="pendente" className="pendente">
                    <h3>PENDENTE</h3>
                    <div>
                        {posts
                            .sort((a, b) => {
                                if (filtro === "alfabetica") {
                                    return a.tarefa.localeCompare(b.tarefa);
                                }

                                if (filtro === "prioridade") {
                                    return b.prioridade.localeCompare(a.prioridade);
                                }

                                const dataA = new Date(a.criadoEm || 0).getTime();
                                const dataB = new Date(b.criadoEm || 0).getTime();

                                if (filtro === "recentes") {
                                    return dataB - dataA; 
                                } else {
                                    return dataA - dataB; 
                                }
                            })
                            .filter((post) => {
                                const correspondeStatus = post.status === "pendente";
                                const correspondeBusca = post.tarefa.toLowerCase().includes(busca.toLowerCase());
                                return correspondeStatus && correspondeBusca;
                            })
                            .map((post) => (
                                <div className="tarefas" key={post.id} onClick={() => clique(post.id)}>
                                    <label>Tarefa : </label>{post.tarefa}
                                    <label>Prioridade: </label>{post.prioridade}

                                    {idSelecionado === post.id && (
                                        <div className="botoestarefa">
                                            <button title="Visualizar" onClick={() => navigate("/Cadastrar", { state: { visualizarTarefa: post, visualizar: true } })}>👁️</button>
                                            <button title="Editar" onClick={() => navigate("/Cadastrar", { state: { editarTarefa: post } })}>📝</button>
                                            <button title="Excluir" onClick={() => excluir(post.id)}>🗑️</button>
                                            <button title="Concluir" onClick={() => concluir(post.id, post.status)}>✅</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>  
                </div>

                <div className="divisoria" aria-hidden></div>

                <div className="concluido">
                    <h3>CONCLUIDO</h3>
                    <div>
                        {posts
                            .sort((a, b) => {
                                if (filtro === "alfabetica") {
                                    return a.tarefa.localeCompare(b.tarefa);
                                }

                                const dataA = new Date(a.criadoEm || 0).getTime();
                                const dataB = new Date(b.criadoEm || 0).getTime();

                                if (filtro === "recentes") {
                                    return dataB - dataA;
                                } else {
                                    return dataA - dataB;
                                }
                            })
                            .filter((post) => {
                                const correspondeStatus = post.status === "concluida";
                                const correspondeBusca = post.tarefa.toLowerCase().includes(busca.toLowerCase());
                                return correspondeStatus && correspondeBusca;
                            })
                            .map((post) => (
                                <div className="tarefas" key={post.id} onClick={() => clique(post.id)}>
                                    <label>Tarefa : </label>{post.tarefa}


                                    {idSelecionado === post.id && (
                                        <div className="botoestarefa">
                                            <button title="Visualizar">👁️</button>
                                            <button title="Excluir" onClick={() => excluir(post.id)}>🗑️</button>
                                            <button title="Retornar" onClick={() => concluir(post.id, post.status)}>🔄</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>  
                </div>
            </div>
        </div>
    );
}

export default Lista
