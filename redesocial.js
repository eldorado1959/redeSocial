var Conta = /** @class */ (function () {
    function Conta(nomeUsuario, senha, informacaoAdicional) {
        this.id = Conta.idsUtilizados.length + 1; // gera um novo ID com base no tamanho do array de IDs utilizados
        Conta.idsUtilizados.push(this.id); // adiciona o ID ao array de IDs utilizados
        this.nomeUsuario = nomeUsuario; // define o nome de usuário
        this.senha = senha; // define a senha do usuário
        this.informacaoAdicional = informacaoAdicional; // define informações adicionais
        this.seguidores = []; // inicia o array de seguidores vazio
        this.seguindo = []; // inicia o array de contas seguidas vazio
        this.posts = []; // inicia o array de posts vazio
        this.mensagensDiretas = []; // inicia o array de mensagens diretas vazio
        this.notificacoes = []; // inicia o array de notificações vazio
    }
    Conta.prototype.seguir = function (conta) {
        if (!this.seguindo.includes(conta.id)) { // verifica se o usuário já está seguindo a conta
            this.seguindo.push(conta.id); // adiciona o ID da conta ao array de contas seguidas
            conta.seguidores.push(this.id); // adiciona o ID do usuário ao array de seguidores da conta seguida
            conta.notificacoes.push(["Novo seguidor", this.id]); // envia uma notificação à conta seguida
        }
    };
    Conta.prototype.enviarMensagem = function (conta, conteudo) {
        conta.mensagensDiretas.push([conteudo, this.id]); // envia uma mensagem direta para a conta
    };
    Conta.prototype.criarPost = function (conteudo) {
        var novoPost = new Post(this.id, conteudo); // cria um novo post com o ID do autor e o conteúdo
        this.posts.push(novoPost); // adiciona o post à lista de posts do usuário
    };
    Conta.idsUtilizados = []; // array estático para armazenar os IDs utilizados
    return Conta;
}());
var Post = /** @class */ (function () {
    function Post(idAutor, conteudo) {
        this.idPost = Post.idPostGlobal++; // gera um ID único para o post
        this.idAutor = idAutor; // define o autor do post
        var dataAtual = new Date(); // obtém a data atual
        this.dataHora = [dataAtual.getDate(), dataAtual.getMonth() + 1, dataAtual.getFullYear()]; // armazena a data no formato [dia, mês, ano]
        this.curtidas = []; // inicia o array de curtidas vazio
        this.comentarios = []; // inicia o array de comentários vazio
    }
    Post.prototype.curtir = function (conta) {
        if (!this.curtidas.includes(conta.id)) { // verifica se a conta já curtiu o post
            this.curtidas.push(conta.id); // adiciona o ID da conta ao array de curtidas
        }
    };
    Post.prototype.comentar = function (conta, comentario) {
        this.comentarios.push([comentario, conta.nomeUsuario]); // adiciona um comentário ao post com o conteúdo e o nome do usuário
    };
    Post.idPostGlobal = 0; // contador estático para gerar IDs únicos para os posts
    return Post;
}());
var Feed = /** @class */ (function () {
    function Feed() {
        this.contas = []; // inicia a lista de contas vazia
    }
    Feed.prototype.criarConta = function (nomeUsuario, senha, informacaoAdicional) {
        var novaConta = new Conta(nomeUsuario, senha, informacaoAdicional); // cria uma nova conta
        this.contas.push(novaConta); // adiciona a nova conta à lista de contas
        return novaConta; // retorna a nova conta criada
    };
    Feed.prototype.login = function (nomeUsuario, senha) {
        var conta = this.contas.find(function (c) { return c.nomeUsuario === nomeUsuario && c.senha === senha; }); // busca uma conta com o nome de usuário e senha fornecidos
        return conta || null; // retorna a conta se encontrada ou null se não encontrada
    };
    Feed.prototype.logout = function () {
        // implementação de logout pode ser feita dependendo do contexto
        console.log("Logout realizado com sucesso"); // exibe mensagem de logout realizado
    };
    Feed.prototype.filtrarPosts = function (conta) {
        return this.contas
            .filter(function (c) { return conta.seguindo.includes(c.id); }) // filtra as contas seguidas pelo usuário
            .flatMap(function (c) { return c.posts; }); // retorna os posts das contas seguidas
    };
    return Feed;
}());
// Exemplo de uso:
var redeSocial = new Feed(); // cria uma nova instância da rede social
var conta1 = redeSocial.criarConta("usuario1", "senha1", "Informações do usuário 1"); // cria a conta 1
var conta2 = redeSocial.criarConta("usuario2", "senha2", "Informações do usuário 2"); // cria a conta 2
conta1.seguir(conta2); // conta1 segue conta2
conta2.criarPost("Meu primeiro post"); // conta2 cria um post
conta1.criarPost("Olá, mundo"); // conta1 cria um post
var postsFiltrados = redeSocial.filtrarPosts(conta1); // filtra os posts no feed da conta1
console.log(postsFiltrados); // exibe os posts filtrados
