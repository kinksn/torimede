import React from "react";

export const PrivacyPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-5 font-zenMaruGothic">
        プライバシーポリシー
      </h1>
      <div className="max-w-[620px] mt-5 mx-auto bg-base-bg border border-primary-50 p-5 rounded-md">
        <PrivacyText />
      </div>
    </div>
  );
};

export const PrivacyText = () => {
  return (
    <article className="flex flex-col gap-10 text-typography-sm leading-loose">
      <p>
        トリメデ（以下「本サービス」）におけるユーザーの個人情報および関連データの取り扱いについて、本プライバシーポリシーに従います。当社（本サービスの運営者）は、ユーザーのプライバシーを尊重し、個人情報の適切な保護と管理に努めます。
      </p>
      <section className="flex flex-col gap-1">
        <h2 className="text-typography-lg font-bold">収集する情報</h2>
        <p>本サービスでは、以下のユーザー情報を収集します。</p>
        <ul className="flex flex-col gap-5 mt-5 [&>li]:before:content-[' '] [&>li]:before:min-w-1 [&>li]:before:min-h-1 [&>li]:before:block [&>li]:before:bg-textColor-basic [&>li]:before:rounded-full [&>li]:before:my-3 [&>li]:before:mx-[10px]">
          <li className="flex items-start">
            <p>
              <span className="font-bold">アカウント情報: </span>
              OAuth認証（NextAuth）を通じて取得するユーザーのメールアドレス等のアカウント情報。これには、ユーザーが外部サービス（Google、LINE、X等）で登録したメールアドレスや表示名などが含まれる場合があります。
            </p>
          </li>
          <li className="flex items-start">
            <p>
              <span className="font-bold">Cookie（クッキー）: </span>
              ユーザーがログインした際に発行されるセッション管理のためのクッキー情報。本サービスでは、ユーザーが継続的にログイン状態を維持する目的でクッキーを使用します。
            </p>
          </li>
          <li className="flex items-start">
            <p>
              <span className="font-bold">利用状況データ: </span>
              本サービスのアクセス解析のために、Vercel
              Analyticsを利用してサイト訪問に関するデータを収集します。収集されるデータには、ページビューや利用環境などの匿名化された統計情報が含まれます（個人を特定する情報は含まれません）。
            </p>
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-1">
        <h2 className="text-typography-lg font-bold">データの取り扱い</h2>
        <p>
          管理者は、ユーザーからお預かりした個人情報を適切に管理し、以下のとおり取り扱います。
        </p>
        <ul className="flex flex-col gap-5 mt-5 [&>li]:before:content-[' '] [&>li]:before:min-w-1 [&>li]:before:min-h-1 [&>li]:before:block [&>li]:before:bg-textColor-basic [&>li]:before:rounded-full [&>li]:before:my-3 [&>li]:before:mx-[10px]">
          <li className="flex items-start">
            <p>
              <span className="font-bold">第三者提供の有無: </span>
              管理者は、ユーザーの個人情報をユーザーの同意なしに第三者へ提供することはありません。ただし、法令に基づく開示要求があった場合や、人命・財産の保護のために緊急に必要がある場合など、法律上許容される場合はこの限りではありません。また、本サービスの運営上、必要な範囲で業務委託先（例:
              本サービスのホスティングや解析を担うサービス提供者）に個人情報の取り扱いを委託することがあります。この場合、管理者は委託先と適切な契約を結び、個人情報が安全に管理されるよう監督します。
            </p>
          </li>
          <li className="flex items-start">
            <p>
              <span className="font-bold">データの保管方法: </span>
              ユーザーの個人情報は、当社が管理する安全なサーバー環境（クラウドサービス上のデータベース等）に保存されます。当社は、収集した情報をサービス提供に必要な期間保管します。ユーザーがアカウントの削除を希望する場合や、保管する必要がなくなった情報については、遅滞なく消去または匿名化するよう努めます。
            </p>
          </li>
          <li className="flex items-start">
            <p>
              <span className="font-bold">セキュリティ対策: </span>
              管理者は、ユーザーの個人情報を取り扱うにあたり、適切なセキュリティ対策を講じます。通信の暗号化（HTTPSの使用）、アクセス制御等の措置により、不正アクセス、情報の漏えい、改ざん等の防止に努めています。また、サービス運営スタッフ等による個人情報へのアクセスは業務上必要な範囲に限定し、情報保護の重要性について周知徹底しています。
            </p>
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-1">
        <h2 className="text-typography-lg font-bold">
          プライバシーポリシーの変更
        </h2>
        <p>
          管理者は、本ポリシーを必要に応じて改定することがあります。プライバシーポリシーの内容を変更する場合、変更後のポリシーを本サービス上で掲示し、更新日を明示します。重大な変更を行う場合には、ユーザーに対して適切な方法で通知いたします。ユーザーが変更後に本サービスの利用を継続した場合には、改定後のプライバシーポリシーに同意したものとみなします。
        </p>
      </section>
      <section className="flex flex-col gap-1">
        <p>附則：本プライバシーポリシーは2025年3月から適用されます。</p>
      </section>
    </article>
  );
};
