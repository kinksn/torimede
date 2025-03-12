import React from "react";

export const TermsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-5 font-zenMaruGothic">
        利用規約
      </h1>
      <div className="max-w-[620px] mt-5 mx-auto bg-base-bg border border-primary-50 p-5 rounded-md">
        <TermsText />
      </div>
    </div>
  );
};

export const TermsText = () => {
  return (
    <article className="flex flex-col gap-10 text-typography-sm leading-loose">
      <p>
        この利用規約（以下「本規約」）は、トリメデ（以下「本サービス」）の利用条件を定めるものです。ユーザーの皆様（以下「ユーザー」）には、本規約に同意いただいた上で、本サービスをご利用いただきます。
      </p>
      <section className="flex flex-col gap-1">
        <h2 className="text-typography-lg font-bold">
          第1条（対象ユーザーおよび利用条件）
        </h2>
        <p>
          ユーザーは、本サービスの利用に必要な通信機器、インターネット接続環境をご自身の責任と費用で用意するものとします。
        </p>
      </section>
      <section className="flex flex-col gap-1">
        <h2 className="text-typography-lg font-bold">第2条（サービス内容）</h2>
        <p>
          本サービスは、鳥に関する写真や情報を共有するためのプラットフォームです。ユーザーは1回の投稿につき、写真を1枚アップロードし、タイトル、本文、および関連タグを設定することができます。投稿された写真やタイトル等のコンテンツは本サービス上で公開され、他のユーザーに閲覧されます。
        </p>
      </section>
      <section className="flex flex-col gap-1">
        <h2 className="text-typography-lg font-bold">
          第3条（外部サービスとの連携）
        </h2>
        <p>
          ユーザー登録およびログインには、NextAuthを用いたOAuth認証を採用しています。ユーザーは、Googleアカウント、LINEアカウント、X（Twitter）アカウントなどの第三者提供の認証サービスと連携して本サービスにログインすることが可能です。これら外部サービスを利用する際は、各サービスの利用規約・ポリシーにも従う必要があります。本サービスは外部認証サービスから提供される情報（ユーザーの氏名、メールアドレス等）をアカウント管理の目的で利用します。なお、外部サービスの障害等により認証ができない場合、本サービスの利用に支障が出る可能性がありますが、それに起因して生じた損害について責任を負いかねます。
        </p>
      </section>
      <section className="flex flex-col gap-1">
        <h2 className="text-typography-lg font-bold">第4条（禁止事項）</h2>
        <p>
          ユーザーは本サービスの利用にあたり以下の行為を行ってはなりません。
        </p>
        <ul className="flex flex-col gap-5 mt-5 [&>li]:before:content-[' '] [&>li]:before:min-w-1 [&>li]:before:min-h-1 [&>li]:before:block [&>li]:before:bg-textColor-basic [&>li]:before:rounded-full [&>li]:before:my-3 [&>li]:before:mx-[10px]">
          <li className="flex items-start">
            <p>
              <span className="font-bold">無断使用の禁止: </span>
              他者が権利を有する写真、文章、イラストなどのリソースを許可なく使用した投稿を行うこと。
            </p>
          </li>
          <li className="flex items-start">
            <p>
              <span className="font-bold">無断使用の禁止: </span>
              他者の著作権、商標権など知的財産権を侵害する行為。ユーザーは、自分が投稿するコンテンツについて適法な権利を有しているか、必要な許可を得ていることを保証するものとします。
            </p>
          </li>
          <li className="flex items-start">
            <p>
              <span className="font-bold">不適切なコンテンツの投稿: </span>
              公序良俗に反する情報や、暴力的・わいせつな表現、嫌がらせや誹謗中傷に該当する内容など、不適切と判断されるコンテンツの投稿。
            </p>
          </li>
          <li className="flex items-start">
            <p>
              <span className="font-bold">その他の禁止行為: </span>
              法令に違反する行為、本サービスの運営を妨害する行為、またはその他管理者が不適切と判断する行為。
            </p>
          </li>
        </ul>
        <p className="mt-5">
          管理者は、ユーザーが上記の禁止事項に該当する行為を行ったと判断した場合、事前の通知なく投稿内容の削除、アカウントの一時停止・停止等の対応を行うことができます。また、禁止事項に違反することによって生じた損害やトラブルについては、ユーザー自身の責任と負担において解決するものとし、管理者は一切の責任を負いません。
        </p>
      </section>
      <section className="flex flex-col gap-1">
        <h2 className="text-typography-lg font-bold">
          第5条（投稿コンテンツの取り扱い）
        </h2>
        <p>
          ユーザーが本サービスに投稿した写真やテキスト等のコンテンツ（以下「投稿コンテンツ」）に関する著作権その他の権利は、原則としてユーザー本人に留保されます。投稿コンテンツについて第三者との間で紛争が生じた場合、ユーザーの責任と費用において解決するものとし、当サービスは関与せず一切の責任を負いません。
        </p>
      </section>
      <section className="flex flex-col gap-1">
        <h2 className="text-typography-lg font-bold">第6条（免責事項）</h2>
        <ol className="flex flex-col gap-5 pl-5 [&>li]:list-decimal [&>li]:marker:font-bold">
          <li>
            <p>
              <span className="font-bold">サービス提供の状態: </span>
              管理者は、当サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、有用性、特定目的適合性、セキュリティ等に関する欠陥やエラー、バグ、権利侵害など）がないことを保証しません。ユーザーは自己責任において本サービスを利用するものとします。
            </p>
          </li>
          <li>
            <p>
              <span className="font-bold">損害責任の否認: </span>
              管理者は、本サービスの利用または利用不能に起因してユーザーに生じたあらゆる損害について、当社の故意または重過失による場合を除き、一切の責任を負いません。
            </p>
          </li>
          <li>
            <p>
              <span className="font-bold">ユーザー間のトラブル: </span>
              ユーザー同士、またはユーザーと第三者との間で生じた紛争やトラブルについて、管理者は一切責任を負いません。ユーザー間の問題は当事者同士で解決するものとします。
            </p>
          </li>
          <li>
            <p>
              <span className="font-bold">損害責任の否認: </span>
              管理者は、本サービスの利用または利用不能に起因してユーザーに生じたあらゆる損害について、当社の故意または重過失による場合を除き、一切の責任を負いません。
            </p>
          </li>
          <li>
            <p>
              <span className="font-bold">サービス内容の変更・停止: </span>
              管理者は、ユーザーへの事前の通知なく、本サービスの内容を変更、追加し、または提供を中止することがあります。当社は、これによりユーザーに生じた損害について一切責任を負いません。当社の故意または重過失による場合を除き、一切の責任を負いません。
            </p>
          </li>
        </ol>
      </section>
      <section className="flex flex-col gap-1">
        <h2 className="text-typography-lg font-bold">第7条（規約の変更）</h2>
        <p>
          管理者は、必要と判断した場合には、ユーザーに通知することなく本規約を変更できるものとします。変更後の本規約は、本サービス上に掲載した時点で効力を生じるものとし、その後ユーザーが本サービスの利用を継続した場合には、変更内容に同意したものとみなします。定期的に本規約の最新の内容をご確認ください。
        </p>
      </section>
      <section className="flex flex-col gap-1">
        <h2 className="text-typography-lg font-bold">
          第8条（準拠法・裁判管轄）
        </h2>
        <p>
          本規約の成立、効力、履行および解釈には日本法が適用されます。本サービスに関連して当社とユーザーとの間で生じた紛争については、日本国の裁判所を管轄裁判所とし、その中でも当社所在地を管轄する裁判所を第一審の専属的合意管轄とします。
        </p>
      </section>
      <section className="flex flex-col gap-1">
        <p>制定：2025年3月</p>
      </section>
    </article>
  );
};
