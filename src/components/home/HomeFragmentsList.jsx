import { useState, useEffect } from "react";
import { getQuotes } from "@/lib/getQuotes.js";

export default function HomeFragmentsList() {
  const [fragments, setFragments] = useState([]);

  useEffect(() => {
    setFragments(getQuotes());
  }, []);

  return (
    <div className="home-fragments__list">
      {fragments.map((fragment) => (
        <article className="home-fragment" key={fragment.title}>
          <div className="home-fragment__meta">
            <p className="home-fragment__author">{fragment.author}</p>
            <time className="home-fragment__date" dateTime={fragment.datetime}>
              {fragment.citeLabel}
            </time>
          </div>
          <h3 className="home-fragment__title">
            <a href={fragment.href}>{fragment.title}</a>
          </h3>
          <p className="home-fragment__excerpt">{fragment.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
