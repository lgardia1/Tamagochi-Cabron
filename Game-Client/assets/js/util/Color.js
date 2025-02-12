export default class Color { 
    static rgb(r, g, b) {
        return Phaser.Display.Color.GetColor(r, g, b);
    }

    static rgba(r, g, b, a) {
        return Phaser.Display.Color.GetColor32(r, g, b, a);
    } 
}