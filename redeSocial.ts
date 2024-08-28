

class Conta {
    static idsUtilizados: number[] = [] // array estático para armazenar os IDs utilizados
    id: number // ID único para cada conta
    nomeUsuario: string // nome de usuário
    senha: string // senha para login
    informacaoAdicional: string // informações adicionais sobre o usuário
    seguidores: number[] // IDs das contas que seguem o usuário
    seguindo: number[] // IDs das contas que o usuário atual segue
    posts: Post[] // lista de posts feitos pelo usuário
    mensagensDiretas: [string, number][] // mensagens diretas recebidas, armazenando conteúdo e ID da conta remetente
    notificacoes: [string, number][] // notificações recebidas, com conteúdo e ID da conta que gerou a notificação

    constructor(nomeUsuario: string, senha: string, informacaoAdicional: string) {
        this.id = Conta.idsUtilizados.length + 1 // gera um novo ID com base no tamanho do array de IDs utilizados
        Conta.idsUtilizados.push(this.id) // adiciona o ID ao array de IDs utilizados
        this.nomeUsuario = nomeUsuario // define o nome de usuário
        this.senha = senha // define a senha do usuário
        this.informacaoAdicional = informacaoAdicional // define informações adicionais
        this.seguidores = [] // inicia o array de seguidores vazio
        this.seguindo = [] // inicia o array de contas seguidas vazio
        this.posts = [] // inicia o array de posts vazio
        this.mensagensDiretas = [] // inicia o array de mensagens diretas vazio
        this.notificacoes = [] // inicia o array de notificações vazio
    }

    seguir(conta: Conta) {
        if (!this.seguindo.includes(conta.id)) { // verifica se o usuário já está seguindo a conta
            this.seguindo.push(conta.id) // adiciona o ID da conta ao array de contas seguidas
            conta.seguidores.push(this.id) // adiciona o ID do usuário ao array de seguidores da conta seguida
            conta.notificacoes.push(["Novo seguidor", this.id]) // envia uma notificação à conta seguida
        }
    }

    enviarMensagem(conta: Conta, conteudo: string) {
        conta.mensagensDiretas.push([conteudo, this.id]) // envia uma mensagem direta para a conta
    }

    criarPost(conteudo: string) {
        const novoPost = new Post(this.id, conteudo) // cria um novo post com o ID do autor e o conteúdo
        this.posts.push(novoPost) // adiciona o post à lista de posts do usuário
    }
}

class Post {
    static idPostGlobal: number = 0 // contador estático para gerar IDs únicos para os posts
    idPost: number // ID único do post
    idAutor: number // ID do autor do post
    dataHora: [number, number, number] // data e hora do post, armazenada como [dia, mês, ano]
    curtidas: number[] // IDs das contas que curtiram o post
    comentarios: [string, string][] // comentários no post, armazenando conteúdo e nome de usuário

    constructor(idAutor: number, conteudo: string) {
        this.idPost = Post.idPostGlobal++ // gera um ID único para o post
        this.idAutor = idAutor // define o autor do post
        const dataAtual = new Date() // obtém a data atual
        this.dataHora = [dataAtual.getDate(), dataAtual.getMonth() + 1, dataAtual.getFullYear()] // armazena a data no formato [dia, mês, ano]
        this.curtidas = [] // inicia o array de curtidas vazio
        this.comentarios = [] // inicia o array de comentários vazio
    }

    curtir(conta: Conta) {
        if (!this.curtidas.includes(conta.id)) { // verifica se a conta já curtiu o post
            this.curtidas.push(conta.id) // adiciona o ID da conta ao array de curtidas
        }
    }

    comentar(conta: Conta, comentario: string) {
        this.comentarios.push([comentario, conta.nomeUsuario]) // adiciona um comentário ao post com o conteúdo e o nome do usuário
    }
}

class Feed {
    contas: Conta[] // lista de contas na rede social

    constructor() {
        this.contas = [] // inicia a lista de contas vazia
    }

    criarConta(nomeUsuario: string, senha: string, informacaoAdicional: string): Conta {
        const novaConta = new Conta(nomeUsuario, senha, informacaoAdicional) // cria uma nova conta
        this.contas.push(novaConta) // adiciona a nova conta à lista de contas
        return novaConta // retorna a nova conta criada
    }

    login(nomeUsuario: string, senha: string): Conta | null {
        const conta = this.contas.find(c => c.nomeUsuario === nomeUsuario && c.senha === senha) // busca uma conta com o nome de usuário e senha fornecidos
        return conta || null // retorna a conta se encontrada ou null se não encontrada
    }

    logout() {
        // implementação de logout pode ser feita dependendo do contexto
        console.log("Logout realizado com sucesso") // exibe mensagem de logout realizado
    }

    filtrarPosts(conta: Conta): Post[] {
        return this.contas
            .filter(c => conta.seguindo.includes(c.id)) // filtra as contas seguidas pelo usuário
            .flatMap(c => c.posts) // retorna os posts das contas seguidas
    }
}

// Exemplo de uso:
const redeSocial = new Feed() // cria uma nova instância da rede social
const conta1 = redeSocial.criarConta("usuario1", "senha1", "Informações do usuário 1") // cria a conta 1
const conta2 = redeSocial.criarConta("usuario2", "senha2", "Informações do usuário 2") // cria a conta 2

conta1.seguir(conta2) // conta1 segue conta2
conta2.criarPost("Meu primeiro post") // conta2 cria um post
conta1.criarPost("Olá, mundo") // conta1 cria um post

const postsFiltrados = redeSocial.filtrarPosts(conta1) // filtra os posts no feed da conta1
console.log(postsFiltrados) // exibe os posts filtrados




