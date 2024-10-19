import { useEffect, useState } from 'react';
import './App.css';

interface Pedido {
  id: number;
  cliente: string;
  servico: string;
  status: 'pendente' | 'em andamento' | 'concluído';
}

function App() {
  const [cliente, setCliente] = useState('');
  const [servico, setServico] = useState('');
  const [status, setStatus] = useState<'pendente' | 'em andamento' | 'concluído'>('pendente');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [editPedido, setEditPedido] = useState<{ enabled: boolean; pedido: Pedido | null }>({
    enabled: false,
    pedido: null
  });

  useEffect(() => {
    const pedidosSalvos = localStorage.getItem('pedidos');
    if (pedidosSalvos) {
      setPedidos(JSON.parse(pedidosSalvos));
    }
  }, []);

  function handleRegister() {
    if (!cliente || !servico) {
      return;
    }

    const newPedido: Pedido = {
      id: Date.now(), // Gera um ID único baseado no timestamp
      cliente,
      servico,
      status
    };

    if (editPedido.enabled && editPedido.pedido) {
      handleSaveEdit(newPedido);
      return;
    }

    const newPedidos = [...pedidos, newPedido];
    setPedidos(newPedidos);
    localStorage.setItem('pedidos', JSON.stringify(newPedidos));
    resetForm();
  }

  function handleDelete(id: number) {
    const removePedido = pedidos.filter(pedido => pedido.id !== id);
    setPedidos(removePedido);
    localStorage.setItem('pedidos', JSON.stringify(removePedido));
  }

  function handleEdit(pedido: Pedido) {
    setCliente(pedido.cliente);
    setServico(pedido.servico);
    setStatus(pedido.status);
    setEditPedido({
      enabled: true,
      pedido
    });
  }

  function handleSaveEdit(updatedPedido: Pedido) {
    const updatedPedidos = pedidos.map(pedido => (pedido.id === updatedPedido.id ? updatedPedido : pedido));
    setPedidos(updatedPedidos);
    localStorage.setItem('pedidos', JSON.stringify(updatedPedidos));
    resetForm();
  }

  function resetForm() {
    setCliente('');
    setServico('');
    setStatus('pendente');
    setEditPedido({ enabled: false, pedido: null });
  }

  return (
    <div>
      <h1>Gerenciamento de Pedidos de Lavanderia</h1>
      <input
        type="text"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        placeholder="Nome do cliente"
      />
      <input
        type="text"
        value={servico}
        onChange={(e) => setServico(e.target.value)}
        placeholder="Tipo de serviço"
      />
      <select value={status} onChange={(e) => setStatus(e.target.value as 'pendente' | 'em andamento' | 'concluído')}>
        <option value="pendente">Pendente</option>
        <option value="em andamento">Em Andamento</option>
        <option value="concluído">Concluído</option>
      </select>
      <button onClick={handleRegister}>
        {editPedido.enabled ? 'Alterar Pedido' : 'Adicionar Pedido'}
      </button>

      <hr />

      {pedidos.map((pedido) => (
        <section key={pedido.id}>
          <span>{pedido.cliente} - {pedido.servico} - {pedido.status}</span>
          <button onClick={() => handleDelete(pedido.id)}>Remover</button>
          <button onClick={() => handleEdit(pedido)}>Editar</button>
        </section>
      ))}
    </div>
  );
}

export default App;
