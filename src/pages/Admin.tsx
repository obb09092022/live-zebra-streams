
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChannelContext } from "@/context/ChannelContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Channel } from "@/lib/channelsData";

const Admin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newChannel, setNewChannel] = useState<Omit<Channel, "id">>({
    name: "",
    streamUrl: "",
    logo: "",
    description: "",
    categories: []
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const { addChannel, availableCategories } = useChannelContext();
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
  
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
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
    
    if (selectedCategories.length === 0) {
      toast({
        title: "Erro ao adicionar canal",
        description: "Selecione pelo menos uma categoria.",
        variant: "destructive"
      });
      return;
    }
    
    const channelToAdd = {
      ...newChannel,
      categories: selectedCategories
    };
    
    const success = addChannel(channelToAdd);
    
    if (success) {
      toast({
        title: "Canal adicionado com sucesso",
        description: `O canal ${newChannel.name} foi adicionado.`
      });
      
      // Limpar formulário
      setNewChannel({
        name: "",
        streamUrl: "",
        logo: "",
        description: "",
        categories: []
      });
      setSelectedCategories([]);
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
          <h1 className="text-2xl font-bold text-center mb-6">Painel Administrativo</h1>
          
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
            
            <div className="text-center">
              <Button variant="link" onClick={() => navigate("/")} className="text-sm">
                Voltar para o site
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
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              Voltar para o site
            </Button>
            <Button variant="destructive" onClick={() => setIsAuthenticated(false)}>
              Sair
            </Button>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Adicionar Novo Canal</h2>
          
          <form onSubmit={handleAddChannel} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="channel-url">URL do Stream</Label>
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
                <Label htmlFor="channel-description">Descrição</Label>
                <Input
                  id="channel-description"
                  value={newChannel.description}
                  onChange={(e) => setNewChannel({...newChannel, description: e.target.value})}
                  placeholder="Descrição breve do canal"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="block mb-2">Categorias</Label>
              <div className="flex flex-wrap gap-2">
                {availableCategories.filter(cat => cat !== "Todos").map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    onClick={() => handleCategoryToggle(category)}
                    className="flex items-center gap-2"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button type="submit" className="w-full mt-6">
              Adicionar Canal
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
