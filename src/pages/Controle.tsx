import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChannelContext } from "@/context/ChannelContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, Plus, Trash2, Edit, RefreshCw, Check, X, 
  Eye, EyeOff, Search, ChevronDown, ChevronUp
} from "lucide-react";
import { Channel } from "@/lib/channelsData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChannelProvider } from "@/context/ChannelContext";

// Definição dos campos do formulário de canal
interface ChannelFormData {
  name: string;
  streamUrl: string;
  logo: string;
  description: string;
  categories: string[];
}

// Componente para o formulário de canal (usado para adicionar e editar)
const ChannelForm: React.FC<{
  initialData?: ChannelFormData;
  availableCategories: string[];
  onSubmit: (data: ChannelFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ initialData, availableCategories, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<ChannelFormData>(
    initialData || {
      name: "",
      streamUrl: "",
      logo: "",
      description: "",
      categories: ["Entretenimento"]
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      if (prev.categories.includes(category)) {
        return { ...prev, categories: prev.categories.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...prev.categories, category] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Canal</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ex: TV Brasil"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="streamUrl">URL do Stream</Label>
        <Input
          id="streamUrl"
          name="streamUrl"
          value={formData.streamUrl}
          onChange={handleChange}
          placeholder="URL do stream (m3u8)"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">URL do Logo</Label>
        <Input
          id="logo"
          name="logo"
          value={formData.logo}
          onChange={handleChange}
          placeholder="URL da imagem do logo"
          required
        />
        {formData.logo && (
          <div className="mt-2 p-2 bg-black/10 rounded flex justify-center">
            <img 
              src={formData.logo} 
              alt="Logo Preview" 
              className="h-16 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/200x100/black/white?text=Preview";
              }}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descrição breve do canal"
        />
      </div>

      <div className="space-y-2">
        <Label>Categorias</Label>
        <div className="grid grid-cols-2 gap-2 p-2 border rounded-md">
          {availableCategories.filter(cat => cat !== "Todos").map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category}`} 
                checked={formData.categories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <label 
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Salvar Canal
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

// Componente interno que tem acesso ao contexto
const ControleContent: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<'id' | 'name'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  const { 
    channels, 
    addChannel,
    updateChannel,
    deleteChannel,
    refreshChannels,
    availableCategories,
    isLoading: isContextLoading
  } = useChannelContext();
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado de carregamento local para operações do painel admin
  const [isLoading, setIsLoading] = useState(false);
  
  // Atualizar canais ao montar o componente
  useEffect(() => {
    if (isAuthenticated) {
      refreshChannels();
    }
  }, [isAuthenticated, refreshChannels]);
  
  // Verificar autenticação salva
  useEffect(() => {
    const savedAuth = localStorage.getItem("zebra-admin-auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "GOLFINHO" && password === "ZEBRA") {
      setIsAuthenticated(true);
      localStorage.setItem("zebra-admin-auth", "true");
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
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("zebra-admin-auth");
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema."
    });
  };
  
  const handleAddChannel = async (data: ChannelFormData) => {
    setIsLoading(true);
    
    try {
      const success = await addChannel({
        name: data.name,
        streamUrl: data.streamUrl,
        logo: data.logo,
        description: data.description,
        categories: data.categories
      });
      
      if (success) {
        setIsAddingChannel(false);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateChannel = async (data: ChannelFormData) => {
    if (!editingChannel) return;
    
    setIsLoading(true);
    
    try {
      const success = await updateChannel({
        id: editingChannel.id,
        name: data.name,
        streamUrl: data.streamUrl,
        logo: data.logo,
        description: data.description,
        categories: data.categories
      });
      
      if (success) {
        setEditingChannel(null);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteChannel = async (id: number) => {
    setIsLoading(true);
    
    try {
      await deleteChannel(id);
    } finally {
      setIsLoading(false);
      setDeleteConfirmId(null);
    }
  };
  
  const handleRefreshChannels = async () => {
    setIsLoading(true);
    await refreshChannels();
    setIsLoading(false);
    
    toast({
      title: "Canais atualizados",
      description: "Lista de canais atualizada com sucesso."
    });
  };
  
  // Classificar e filtrar canais
  const sortedAndFilteredChannels = [...channels]
    .filter(channel => 
      channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (channel.description && channel.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortField === 'id') {
        return sortDirection === 'asc' 
          ? a.id - b.id 
          : b.id - a.id;
      } else {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
    });
  
  const toggleSort = (field: 'id' | 'name') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Painel de Controle</h1>
            <p className="text-muted-foreground">Gerenciamento de canais da TV Zebra</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
              <EyeOff size={16} />
              Logout
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-1">
              <ArrowLeft size={16} />
              Voltar ao site
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Estatísticas e Informações */}
          <div className="bg-card p-6 rounded-lg shadow-lg col-span-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold">Canais Cadastrados</h2>
                <p className="text-muted-foreground">Total: {channels.length} canais</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshChannels}
                  disabled={isLoading || isContextLoading}
                >
                  <RefreshCw size={16} className={isLoading || isContextLoading ? "animate-spin" : ""} />
                  <span className="ml-1 hidden sm:inline">Atualizar</span>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsAddingChannel(true)}>
                      <Plus size={16} />
                      <span className="ml-1">Novo Canal</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Canal</DialogTitle>
                      <DialogDescription>
                        Preencha os dados do canal para adicioná-lo à plataforma.
                      </DialogDescription>
                    </DialogHeader>
                    <ChannelForm
                      availableCategories={availableCategories}
                      onSubmit={handleAddChannel}
                      onCancel={() => setIsAddingChannel(false)}
                      isLoading={isLoading}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Busca e filtros */}
            <div className="flex gap-2 items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Buscar canais..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select 
                value={`${sortField}-${sortDirection}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split('-');
                  setSortField(field as 'id' | 'name');
                  setSortDirection(direction as 'asc' | 'desc');
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id-asc">ID (crescente)</SelectItem>
                  <SelectItem value="id-desc">ID (decrescente)</SelectItem>
                  <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Tabela de canais */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] cursor-pointer" onClick={() => toggleSort('id')}>
                      <div className="flex items-center">
                        ID
                        {sortField === 'id' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="w-[60px]">Logo</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort('name')}>
                      <div className="flex items-center">
                        Nome
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">URL</TableHead>
                    <TableHead className="w-[150px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isContextLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <RefreshCw className="animate-spin w-6 h-6 mx-auto mb-2" />
                        <p>Carregando canais...</p>
                      </TableCell>
                    </TableRow>
                  ) : sortedAndFilteredChannels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <p className="text-muted-foreground">Nenhum canal encontrado</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedAndFilteredChannels.map((channel) => (
                      <TableRow key={channel.id}>
                        <TableCell className="font-medium">{channel.id}</TableCell>
                        <TableCell>
                          <img 
                            src={channel.logo} 
                            alt={channel.name} 
                            className="w-10 h-10 object-contain bg-black/10 rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/48x48/black/white?text=TV";
                            }}
                          />
                        </TableCell>
                        <TableCell>{channel.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-xs max-w-[200px] truncate block">{channel.streamUrl}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setEditingChannel(channel)}
                                >
                                  <Edit size={14} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Editar Canal</DialogTitle>
                                  <DialogDescription>
                                    Atualize as informações do canal {channel.name}
                                  </DialogDescription>
                                </DialogHeader>
                                {editingChannel && (
                                  <ChannelForm
                                    initialData={{
                                      name: editingChannel.name,
                                      streamUrl: editingChannel.streamUrl,
                                      logo: editingChannel.logo,
                                      description: editingChannel.description,
                                      categories: editingChannel.categories
                                    }}
                                    availableCategories={availableCategories}
                                    onSubmit={handleUpdateChannel}
                                    onCancel={() => setEditingChannel(null)}
                                    isLoading={isLoading}
                                  />
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteConfirmId(channel.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                            
                            <Dialog open={deleteConfirmId === channel.id} onOpenChange={(open) => {
                              if (!open) setDeleteConfirmId(null);
                            }}>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirmar Exclusão</DialogTitle>
                                  <DialogDescription>
                                    Tem certeza que deseja excluir o canal "{channel.name}"? Esta ação não pode ser desfeita.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setDeleteConfirmId(null)}
                                    disabled={isLoading}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => handleDeleteChannel(channel.id)}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? (
                                      <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Excluindo...
                                      </>
                                    ) : (
                                      <>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir
                                      </>
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Detalhes de um canal selecionado */}
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Detalhes dos Canais</h2>
            <Accordion type="single" collapsible className="w-full">
              {sortedAndFilteredChannels.slice(0, 5).map((channel) => (
                <AccordionItem key={channel.id} value={`channel-${channel.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <img 
                        src={channel.logo} 
                        alt={channel.name} 
                        className="w-6 h-6 object-contain bg-black/10 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/48x48/black/white?text=TV";
                        }}
                      />
                      <span>{channel.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <div>
                        <p className="text-sm font-medium">ID do Canal</p>
                        <span className="text-sm text-muted-foreground">{channel.id}</span>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">URL do Stream</p>
                        <p className="text-sm text-muted-foreground break-all">{channel.streamUrl}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Descrição</p>
                        <p className="text-sm text-muted-foreground">{channel.description || "Sem descrição"}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Categorias</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {channel.categories.map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2 flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingChannel(channel)}
                            >
                              <Edit size={14} className="mr-1" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Editar Canal</DialogTitle>
                              <DialogDescription>
                                Atualize as informações do canal {channel.name}
                              </DialogDescription>
                            </DialogHeader>
                            {editingChannel && (
                              <ChannelForm
                                initialData={{
                                  name: editingChannel.name,
                                  streamUrl: editingChannel.streamUrl,
                                  logo: editingChannel.logo,
                                  description: editingChannel.description,
                                  categories: editingChannel.categories
                                }}
                                availableCategories={availableCategories}
                                onSubmit={handleUpdateChannel}
                                onCancel={() => setEditingChannel(null)}
                                isLoading={isLoading}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Abrir o canal no site
                            navigate("/");
                          }}
                        >
                          <Eye size={14} className="mr-1" />
                          Visualizar
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {sortedAndFilteredChannels.length > 5 && (
              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  onClick={() => {
                    const element = document.querySelector('.rounded-md.border');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Ver todos os {sortedAndFilteredChannels.length} canais
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Instruções e Ajuda */}
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Instruções de Uso</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Como gerenciar canais</h3>
              <p className="text-muted-foreground">
                Neste painel, você pode adicionar, editar e excluir canais que serão exibidos na TV Zebra.
                As alterações são sincronizadas automaticamente para todos os usuários do site.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Campos obrigatórios</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-2">
                <li><strong>Nome:</strong> O nome do canal que será exibido no site</li>
                <li><strong>URL do Stream:</strong> Endereço do stream .m3u8 do canal</li>
                <li><strong>Logo:</strong> URL da imagem do logo do canal</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Dicas</h3>
              <ul className="list-disc list-inside text-muted-foreground ml-2">
                <li>Utilize streams públicos e estáveis para melhor experiência</li>
                <li>Mantenha os logos com resolução adequada (recomendado: 200x200px)</li>
                <li>Categorize os canais corretamente para facilitar a navegação</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper que fornece o contexto
const Controle: React.FC = () => {
  return (
    <ChannelProvider>
      <ControleContent />
    </ChannelProvider>
  );
};

export default Controle;
