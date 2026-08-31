export default function BackgammonRules() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">目的</h3>
        <p className="mt-2">
          自分の15個の駒を全て「上がり(ベアオフ)」させた方の勝ちです。相手より先に全ての駒を盤の外へ出しましょう。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">初期配置と駒の進む方向</h3>
        <p className="mt-2">
          両者15個ずつの駒が盤上に配置された状態から始まります。自分の駒は盤上を一方向に進み、相手の駒は逆方向に進みます。自分の駒は「自分から見た24の地点」から「1の地点」へ向かって進み、全ての駒が自分のホームエリア(1〜6の地点)に集まったらベアオフができるようになります。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">ダイスの振り方</h3>
        <p className="mt-2">
          毎ターン、2個のサイコロを振ります。出た2つの目の分だけ、それぞれ1回ずつ駒を進められます。同じ目が2つ出た「ゾロ目」の場合は、その目を4回分使うことができます(例えば「6・6」なら6を4回使えます)。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">ヒットとバー、再入場</h3>
        <p className="mt-2">
          移動先の地点に相手の駒が1個だけ置かれている場合は、その駒を「ヒット」して弾き出すことができます。ヒットされた駒は盤の中央の「バー」に置かれ、再度盤に入り直すまでは他の駒を動かせません。
        </p>
        <p className="mt-2">
          バーにある駒は、サイコロの目に応じて相手のホームエリア側から再入場します。バーに自分の駒がある間は、必ずその駒の再入場を優先させなければならず、他の駒を動かすことはできません。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">使えるダイスは最大限使う</h3>
        <p className="mt-2">
          そのターンに振った目は、合法な範囲でできるだけ多く使い切らなければなりません。片方の目しか使えない状況では、より多くの目を使える方の選択肢が優先されます。どちらの目も使える手が存在しない場合は、そのターンはパスになります。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">ベアオフの条件</h3>
        <p className="mt-2">
          自分の駒が全てホームエリア(1〜6の地点)に集まって初めて、駒を盤の外へ出す「ベアオフ」ができます。出た目とちょうど同じ地点番号の駒は、その目で必ずベアオフできます。目がその駒の地点番号より大きい場合でも、ホームエリア内にその駒より地点番号の大きい駒が1つも残っていなければ、その目でベアオフすることができます。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">先手決め</h3>
        <p className="mt-2">
          対局開始時、まず1個ずつサイコロを振って先手を決めます。大きい目を出した方が先手となり、その2つの出目がそのまま最初のターンのダイスとして使われます。同じ目が出た場合は振り直しです。
        </p>
      </section>

      <section>
        <h3 className="text-base font-bold text-[var(--foreground)]">本アプリの簡略化点</h3>
        <p className="mt-2">
          本アプリでは、ダブリングキューブ(倍賭けルール)は実装していません。
        </p>
      </section>
    </div>
  );
}
