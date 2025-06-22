export class InstructionScene extends Phaser.Scene {
  parentScene;

  constructor() {
    super('InstructionScene');
  }

  init(data) {
    this.parentScene = data.parentScene;
    this.levelConfig = data.levelConfig;
    this.getDescricaoNivel = data.getDescricaoNivel;
  }

  create() {
    const largura = this.scale.width;
    const altura = this.scale.height;

    this.add.rectangle(0, 0, largura * 2, altura * 2, 0x000000, 0.75).setOrigin(0);

    const painel = this.add.rectangle(largura / 2, altura / 2, 520, 360, 0x000000, 0.9)
      .setOrigin(0.5)
      .setDepth(1);

    let tituloTexto = '';
    let linhas = [];

    const config = this.levelConfig ?? {};
    const modo = config.modo;

    if (modo === 'tempo-kill' && config.killObjective !== undefined) {
      const [one, two, three] = config.timeThresholds ?? [45000, 30000, 20000];
      tituloTexto = `Elimina ${config.killObjective} inimigos o mais rápido possível!`;
      linhas = [
        `3 Estrelas: até ${three / 1000}s`,
        `2 Estrelas: até ${two / 1000}s`,
        `1 Estrela: até ${one / 1000}s`,
      ];
    } else if (modo === 'sniper' && config.killObjective !== undefined) {
      const [three, two, one] = config.bulletThresholds ?? [15, 25, 40];
      tituloTexto = `Elimina ${config.killObjective} inimigos com poucas balas!`;
      linhas = [
        `3 Estrelas: ≤ ${three} balas`,
        `2 Estrelas: ≤ ${two} balas`,
        `1 Estrela: ≤ ${one} balas`,
      ];
    } else if (modo === 'tempo' && config.starKillThresholds) {
      const [three, two, one] = config.starKillThresholds;
      tituloTexto = 'Elimina o maior número de inimigos!';
      linhas = [
        `3 Estrelas: ≥ ${three} kills`,
        `2 Estrelas: ≥ ${two} kills`,
        `1 Estrela: ≥ ${one} kills`,
      ];
    } else if (modo === 'sem-armas') {
      tituloTexto = 'Sobrevive 45 segundos!';
      linhas = [
           `3 Estrelas: 3 vidas restantes`,
           `2 Estrelas: 2 vidas`,
           `1 Estrela: 1 vida`,
      ];
    } else if (config.starThresholds) {
      const [three, two, one] = config.starThresholds;
      tituloTexto = 'Faz o maior número de pontos possível!';
      linhas = [
        `3 Estrelas: ≥ ${three} pts`,
        `2 Estrelas: ≥ ${two} pts`,
        `1 Estrela: ≥ ${one} pts`,
      ];
    } else if (modo === 'tempo') {
      tituloTexto = 'Sobrevive durante 60 segundos!';
      linhas = [
           `3 Estrelas: 3 vidas restantes`,
           `2 Estrelas: 2 vidas`,
           `1 Estrela: 1 vida`,
      ];
    }

    this.add.text(largura / 2, altura / 2 - 120, tituloTexto, {
      fontSize: '18px',
      color: '#ffffff',
      align: 'center',
      fontFamily: 'monospace',
      wordWrap: { width: 460 },
    }).setOrigin(0.5).setDepth(2);

    linhas.forEach((linha, i) => {
      this.add.text(largura / 2, altura / 2 - 50 + i * 30, linha, {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'monospace',
      }).setOrigin(0.5).setDepth(2);
    });

    this.add.text(largura / 2, altura / 2 + 100, 'Pressiona ESPAÇO para continuar', {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(2);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.stop();
      this.scene.resume(this.parentScene); 
    });
  }
}
