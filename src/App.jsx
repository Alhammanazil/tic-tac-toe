import { useState } from "react";

// Komponen Square: Menggambarkan sebuah kotak pada papan permainan
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Komponen Board: Mengatur tampilan dan logika papan permainan
function Board({ xIsNext, squares, onPlay }) {
  // Fungsi untuk menangani klik pada kotak tertentu
  function handleClick(i) {
    // Mencegah klik jika kotak sudah terisi atau sudah ada pemenang
    if (squares[i] || calculateWinner(squares)) return;

    // Membuat salinan array squares untuk menjaga prinsip immutability
    const nextSquares = squares.slice();
    // Menentukan nilai 'X' atau 'O' berdasarkan giliran pemain
    nextSquares[i] = xIsNext ? "X" : "O";
    // Memanggil fungsi onPlay untuk memperbarui status permainan
    onPlay(nextSquares);
  }

  // Menentukan pemenang atau giliran pemain berikutnya
  const winner = calculateWinner(squares);
  const isDraw = squares.every((square) => square !== null); // Cek jika semua kotak sudah terisi
  const status = winner
    ? `Winner: ${winner} 🎉` // Jika ada pemenang
    : isDraw
    ? "Draw!" // Jika tidak ada pemenang dan semua kotak terisi
    : `Next player: ${xIsNext ? "X" : "O"}`; // Jika permainan masih berjalan

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((square, index) => (
          <Square
            key={index}
            value={square}
            onSquareClick={() => handleClick(index)}
          />
        ))}
      </div>
    </>
  );
}

// Komponen Game: Mengatur logika permainan secara keseluruhan
export default function Game() {
  // State untuk mengatur giliran pemain dan riwayat langkah permainan
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  // Fungsi untuk menangani perubahan langkah dalam permainan
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext); // Berpindah giliran pemain
  }

  // Fungsi untuk melompat ke langkah tertentu dalam riwayat
  function jumpTo(move) {
    const isXNext = move % 2 === 0; // Menentukan giliran berdasarkan urutan langkah
    setXIsNext(isXNext);
    setHistory(history.slice(0, move + 1));
  }

  // Membuat daftar langkah dalam riwayat permainan
  const moves = history.map((squares, move) => {
    const description = move ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Fungsi untuk menghitung pemenang permainan
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Mengecek setiap garis kemenangan yang mungkin
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Mengembalikan simbol pemenang ('X' atau 'O')
    }
  }
  return null; // Tidak ada pemenang
}
