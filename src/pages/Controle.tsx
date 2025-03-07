
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChannelContext } from "@/context/ChannelContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Channel } from "@/lib/channelsData";

const Controle: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [newChannel, setNewChannel] = useState<Omit<Channel, "id" | "categories">>({
    name: "",
    streamUrl: "",
    logo: "",
    description: ""
  });
  
  const [channelNumber, setChannelNumber] = useState("");
  
  const { 
    channels, 
    addChannel
  } = useChannelContext();
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "GOLFINHO" && password === "ZEBRA") {
      setIsAuthenticated(true);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo.",
      });
    } else {
      toast({
        title: "Erro de autenticação",
        description: "Usuário ou senha incorretos.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newChannel.name || !newChannel.streamUrl || !newChannel.logo) {
      toast({
        title: "Erro ao adicionar canal",
        description: "Nome, URL do stream e logo são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const channelNumberInt = parseInt(channelNumber);
    if (isNaN(channelNumberInt)) {
      toast({
        title: "Erro ao adicionar canal",
        description: "O número do canal deve ser um valor numérico.",
        variant: "destructive"
      });
      return;
    }
    
    // Verifica se já existe um canal com esse número
    const existingChannel = channels.find(c => c.id === channelNumberInt);
    if (existingChannel) {
      toast({
        title: "Erro ao adicionar canal",
        description: "Já existe um canal com esse número.",
        variant: "destructive"
      });
      return;
    }
    
    const channelToAdd = {
      ...newChannel,
      id: channelNumberInt,
      categories: ["Entretenimento"] // Categoria padrão para novos canais
    };
    
    const success = addChannel(channelToAdd);
    
    if (success) {
      toast({
        title: "Canal adicionado com sucesso",
        description: `O canal ${newChannel.name} foi adicionado.`
      });
      
      // Limpar o formulário
      setNewChannel({
        name: "",
        streamUrl: "",
        logo: "",
        description: ""
      });
      setChannelNumber("");
    } else {
      toast({
        title: "Erro ao adicionar canal",
        description: "Não foi possível adicionar o canal. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Painel de Controle</h1>
            <Button variant="outline" size="sm" onClick={() => navigate("/")} className="flex items-center gap-1">
              <ArrowLeft size={16} />
              Voltar
            </Button>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nome de usuário"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                required
              />
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Painel de Controle</h1>
          <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-1">
            <ArrowLeft size={16} />
            Voltar ao site
          </Button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Adicionar Novo Canal</h2>
          
          <form onSubmit={handleAddChannel} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="channel-number">Número do Canal</Label>
                <Input
                  id="channel-number"
                  value={channelNumber}
                  onChange={(e) => setChannelNumber(e.target.value)}
                  placeholder="Ex: 1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="channel-url">URL do Canal</Label>
                <Input
                  id="channel-url"
                  value={newChannel.streamUrl}
                  onChange={(e) => setNewChannel({...newChannel, streamUrl: e.target.value})}
                  placeholder="URL do stream (m3u8)"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="channel-logo">Logo do Canal</Label>
                <Input
                  id="channel-logo"
                  value={newChannel.logo}
                  onChange={(e) => setNewChannel({...newChannel, logo: e.target.value})}
                  placeholder="URL da imagem do logo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="channel-name">Nome do Canal</Label>
                <Input
                  id="channel-name"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                  placeholder="Ex: TV Brasil"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="channel-description">Descrição do Canal</Label>
                <Input
                  id="channel-description"
                  value={newChannel.description}
                  onChange={(e) => setNewChannel({...newChannel, description: e.target.value})}
                  placeholder="Descrição breve do canal"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full mt-6">
              Adicionar Canal
            </Button>
          </form>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Canais Cadastrados</h2>
          
          {channels.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 px-3 text-left">Número</th>
                    <th className="py-2 px-3 text-left">Logo</th>
                    <th className="py-2 px-3 text-left">Nome</th>
                    <th className="py-2 px-3 text-left">URL</th>
                    <th className="py-2 px-3 text-left">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {channels.map(channel => (
                    <tr key={channel.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 px-3">{channel.id}</td>
                      <td className="py-2 px-3">
                        <img 
                          src={channel.logo} 
                          alt={channel.name} 
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/48x48/black/white?text=TV";
                          }}
                        />
                      </td>
                      <td className="py-2 px-3">{channel.name}</td>
                      <td className="py-2 px-3 text-xs max-w-[200px] truncate">{channel.streamUrl}</td>
                      <td className="py-2 px-3 max-w-[200px] truncate">{channel.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum canal cadastrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Controle;
