import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate,useLocation } from "react-router-dom"
import Swal from 'sweetalert2'
import './CadastrarTarefa.css'

function CadastrarTarefa() {

    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, reset } = useForm()
    const editarTarefa = location.state?.editarTarefa;
    const visualizarTarefa = location.state?.visualizarTarefa;
    const visualizar = location.state?.visualizar;

    useEffect(() => {
        const botao = document.getElementById("salvar");
        if (editarTarefa) {
            reset({
                tarefa: editarTarefa.tarefa,
                descricao: editarTarefa.descricao,
                prioridade: editarTarefa.prioridade
            });
        }
        if (visualizarTarefa) {
            reset({
                tarefa: visualizarTarefa.tarefa,
                descricao: visualizarTarefa.descricao,
                prioridade: visualizarTarefa.prioridade
            });
            if (botao) {
                botao.style.display = "none";
            }
        }
    }, [editarTarefa, reset]);


    const onSubmit = async (data: any) => {

        if (!editarTarefa) {
            data.criadoEm = new Date().toISOString();
        } else {
            data.criadoEm = editarTarefa.criadoEm;
        }

        try {
            data.status = editarTarefa ? editarTarefa.status : "pendente";

            if (!data.tarefa || !data.tarefa.trim()) {
                Swal.fire({
                    icon: "error",
                    title: "Falta Informação",
                    text: "O campo nome da tarefa deve ser preenchido",
                });
                return;
            }

            const url = editarTarefa
                ? `http://localhost:3001/tarefas/${editarTarefa.id}`
                : "http://localhost:3001/tarefas";

            const metodo = editarTarefa ? "PUT" : "POST";

            const resposta = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

        if (resposta.ok) {
            Swal.fire({
                title: editarTarefa ? 'Tarefa atualizada com sucesso' : 'Tarefa salva com sucesso',
                text: editarTarefa ? 'Deseja voltar para a listagem?' : 'Deseja cadastrar uma nova tarefa?',
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sim",
                cancelButtonText: "Não",
            }).then((result) => {
                if (result.isConfirmed) {
                    if (editarTarefa) {
                        navigate("/");
                    } else {
                        reset();
                    }
                } else {
                    if (!editarTarefa) navigate("/");
                }
            });
        }
    } catch (erro) {
            Swal.fire({
                icon: "error",
                title: "Erro ao salvar",
                text: "Falha ao salvar sua tarefa",
            });
    }
}

    return (
        <div className="container">
            <h1>Cadastro de Tarefas</h1>
            <form id="tarefasForm" className="form" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="tarefa">Nome da tarefa</label>
                    <input
                        type="text"
                        id="tarefa"
                        {...register("tarefa")}
                        disabled={visualizar}/>
                </div>

                <div>
                    <label htmlFor="descricao">Descrição</label>
                    <textarea
                        id="descricao"
                        {...register("descricao")}
                        disabled={visualizar}/>
                </div>

                <div>
                    <label htmlFor="prioridade">Defina a prioridade:</label>
                    <select id="prioridade" {...register("prioridade")}
                        disabled={visualizar}>
                        <option value="Baixa">Baixa</option>
                        <option value="Media">Média</option>
                        <option value="Alta">Alta</option>
                        <option value="Urgente">Urgente</option>
                    </select>
                </div>

                <div className="bottoes">
                    <button id="salvar" type="submit">Salvar</button>
                    <Link to="/" className="voltar" style={{ textDecoration: 'none' }}>
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}
export default CadastrarTarefa
