import React from "react";
import "./globals.css";

// Idk
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Welcome to My Next.js App</h1>
      <p className="Description">
        As a developer, I am constantly seeking new challenges and opportunities to grow and improve my skills. One of
        the most important things that I have learned is the importance of having a strong online presence. A
        well-designed portfolio website can be a powerful tool for attracting potential clients and showcasing your
        abilities. In this essay, I will discuss the importance of having a strong online presence, as well as some of
        the key features and technologies that I used to build my portfolio website. A strong online presence is
        essential for any developer who wants to be successful. It provides a platform for showcasing your skills and
        experience, as well as attracting potential clients and collaborators. Without a strong online presence, it can
        be difficult to get noticed and stand out from the crowd. When building my portfolio website, I decided to use
        Next.js, a popular React framework. Next.js provides a powerful set of tools and features that make it easy to
        build fast, scalable, and secure websites. Some of the key features of Next.js include server-side rendering,
        static site generation, and built-in support for internationalization and accessibility. In addition to Next.js,
        I also used a number of other technologies and tools to build my portfolio website. These include Tailwind CSS,
        a popular CSS framework, and TypeScript, a statically typed programming language. Tailwind CSS provides a
        powerful set of pre-defined classes and utilities that make it easy to quickly and easily style your website.
        TypeScript, on the other hand, provides a number of benefits, including improved code quality and
        maintainability, as well as better performance and scalability. Overall, I am very pleased with how my portfolio
        website has turned out. I believe that it effectively showcases my skills and experience, and I am excited to
        continue improving and adding to it in the future.{" "}
      </p>
    </div>
  );
}
