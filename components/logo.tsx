import Link from "next/link";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Chile DAO, inicio">
      <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>Chile<span>DAO</span></span>
    </Link>
  );
}
