import Link from 'next/link';

export default function Logo({ location = '', closeBurgerHandler = null }) {
  return (
    <div className={`logo ${location}`}>
      <Link href="/">
        <a className="logo_link" onClick={closeBurgerHandler}>
          <img src="/assets/img/logo.png" alt="лого JoinUp!" width="110" height="41" />
        </a>
      </Link>
    </div>
  );
}
