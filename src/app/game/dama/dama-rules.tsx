export default function DamaRules() {
  return (
    <>
      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">盤と初期配置</h3>
        <p className="mt-2">
          8×8マスの盤のうち、暗い色のマスだけを使います。両者12駒ずつを持ち、あなた（人間）は盤の手前3段、CPUは盤の奥3段に配置してスタートします。中央の2段は最初は空いています。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">駒の進む方向</h3>
        <p className="mt-2">
          あなたの駒は奥（相手側）へ、CPUの駒は手前（あなた側）へ向かって進みます。一般駒は自分の進行方向、斜め前方にしか動けません。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">一般駒の移動と捕獲</h3>
        <p className="mt-2">
          斜め前方1マスが空いていればそこへ移動できます。斜め前方に相手の駒が隣接していて、その先（2マス先）が空いていれば、相手の駒を飛び越えて捕獲できます。後方への移動・捕獲はできません。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--accent)]">捕獲は任意です</h3>
        <p className="mt-2">
          ダマの大きな特徴です。捕獲できる状況であっても、必ず捕獲しなければならないわけではありません。別の駒を動かすなど、他の合法手を自由に選べます。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--accent)]">連続捕獲も任意です</h3>
        <p className="mt-2">
          1回捕獲した駒がその場からさらに捕獲できる場合も、続けて捕獲するか、そこで手番を終えるかを自由に選べます。連続捕獲が強制されることはありません。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">昇格（ダマになる）</h3>
        <p className="mt-2">
          一般駒が盤の最も奥の列（あなたなら一番奥、CPUなら手前の最終列）に到達すると、「ダマ（王）」に昇格します。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">王（ダマ）の移動と捕獲</h3>
        <p className="mt-2">
          王は前後どちらの斜め方向にも、途中のマスが空いている限り何マスでも移動できます（フライングキング）。斜め方向に相手の駒がちょうど1個だけあり、その直後が空いていれば、飛び越えて捕獲できます。捕獲後の着地マスは、駒の直後から次に何かにぶつかる手前までの空いているマスの中から自由に選べます。
        </p>
        <p className="mt-2">
          ただし、相手の駒が2個以上連続で並んでいる場合は、その手前までしか進めず、飛び越えることもできません。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">勝敗</h3>
        <p className="mt-2">相手の駒が0枚になるか、自分の手番で合法手が1つもなくなった場合、負けとなります。</p>
      </section>
    </>
  );
}
