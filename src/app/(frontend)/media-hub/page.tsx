/** @format */

import { BookYourStay } from "@/components/sections/BookYourStay";
import { Subscribe } from "@/components/sections/Subscribe";
import { ArticleBody } from "@/components/sections/ArticleBody";
import { ArticleConclusion } from "@/components/sections/ArticleConclusion";
import { Faq } from "@/components/sections/Faq";

export default function MediaHubPage() {
  return (
    <>
      <ArticleBody />
      <Faq />
      <ArticleConclusion />
      <BookYourStay />
      <Subscribe />
    </>
  );
}
