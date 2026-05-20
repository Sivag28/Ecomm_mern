export default function Contact() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen wavy-bg">
      <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
      <p>If you have any questions, feel free to reach out!</p>
      <form className="mt-6">
        <input type="text" placeholder="Name" className="block w-full p-2 mb-4 border" />
        <input type="email" placeholder="Email" className="block w-full p-2 mb-4 border" />
        <textarea placeholder="Message" className="block w-full p-2 mb-4 border" rows="5"></textarea>
        <button type="submit" className="bg-accent text-white px-6 py-3 rounded-lg">Send</button>
      </form>
    </section>
  );
}
