import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChannelContext } from "@/context/ChannelContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Channel } from "@/lib/channelsData";
import { Edit, Search, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChannelFormData extends Omit<Channel, "id"> {}

const Admin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newChannel, setNewChannel] = useState<ChannelFormData>({
    name: "",
    streamUrl: "",
    logo: "",
    description: "",
    categories: []
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteChannelId, setDeleteChannelId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { 
    channels, 
    addChannel, 
    availableCategories,
    updateChannel,
    deleteChannel 
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
  
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const handleEditCategoryToggle = (category: string) => {
    if (!editingChannel) return;
    
    const currentCategories = [...editingChannel.categories];
    
    if (currentCategories.includes(category)) {
      setEditingChannel({
        ...editingChannel,
        categories: currentCategories.filter(c => c !== category)
      });
    } else {
      setEditingChannel({
        ...editingChannel,
        categories: [...currentCategories, category]
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
  
  const openEditDialog = (channel: Channel) => {
    setEditingChannel(channel);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateChannel = () => {
    if (!editingChannel) return;
    
    if (!editingChannel.name || !editingChannel.streamUrl || !editingChannel.logo) {
      toast({
        title: "Erro ao atualizar canal",
        description: "Nome, URL do stream e logo são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingChannel.categories.length === 0) {
      toast({
        title: "Erro ao atualizar canal",
        description: "Selecione pelo menos uma categoria.",
        variant: "destructive"
      });
      return;
    }
    
    const success = updateChannel(editingChannel);
    
    if (success) {
      toast({
        title: "Canal atualizado com sucesso",
        description: `O canal ${editingChannel.name} foi atualizado.`
      });
      setIsEditDialogOpen(false);
      setEditingChannel(null);
    } else {
      toast({
        title: "Erro ao atualizar canal",
        description: "Não foi possível atualizar o canal. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const openDeleteDialog = (channelId: number) => {
    setDeleteChannelId(channelId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteChannel = () => {
    if (deleteChannelId === null) return;
    
    const success = deleteChannel(deleteChannelId);
    
    if (success) {
      toast({
        title: "Canal excluído com sucesso",
        description: "O canal foi removido da lista."
      });
    } else {
      toast({
        title: "Erro ao excluir canal",
        description: "Não foi possível excluir o canal.",
        variant: "destructive"
      });
    }
    
    setIsDeleteDialogOpen(false);
    setDeleteChannelId(null);
  };
  
  const filteredChannels = channels.filter(channel => 
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
        
        <div className="bg-card p-6 rounded-lg shadow-lg mb-6">
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
        
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Gerenciar Canais</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar canais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            {filteredChannels.length > 0 ? (
              filteredChannels.map(channel => (
                <div key={channel.id} className="flex items-center justify-between p-3 bg-background rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <img 
                      src={channel.logo} 
                      alt={channel.name} 
                      className="w-10 h-10 object-contain rounded bg-white/10 p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/48x48/black/white?text=TV";
                      }}
                    />
                    <div>
                      <h3 className="font-medium">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground">{channel.categories.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditDialog(channel)}
                    >
                      <Edit size={16} className="mr-1" /> Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => openDeleteDialog(channel.id)}
                    >
                      <Trash2 size={16} className="mr-1" /> Excluir
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Nenhum canal encontrado.
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Channel Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Canal</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias nos dados do canal.
            </DialogDescription>
          </DialogHeader>
          
          {editingChannel && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome do Canal</Label>
                  <Input
                    id="edit-name"
                    value={editingChannel.name}
                    onChange={(e) => setEditingChannel({...editingChannel, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-url">URL do Stream</Label>
                  <Input
                    id="edit-url"
                    value={editingChannel.streamUrl}
                    onChange={(e) => setEditingChannel({...editingChannel, streamUrl: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-logo">Logo do Canal</Label>
                  <Input
                    id="edit-logo"
                    value={editingChannel.logo}
                    onChange={(e) => setEditingChannel({...editingChannel, logo: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Input
                    id="edit-description"
                    value={editingChannel.description}
                    onChange={(e) => setEditingChannel({...editingChannel, description: e.target.value})}
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
                      variant={editingChannel.categories.includes(category) ? "default" : "outline"}
                      onClick={() => handleEditCategoryToggle(category)}
                      className="flex items-center gap-2"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateChannel}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este canal? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteChannel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
