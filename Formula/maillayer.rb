class EmailSdk < Formula
  desc "Lightweight TypeScript SDK and CLI for unified email sending"
  homepage "https://github.com/chirraaggggg/maillayer"
  url "https://registry.npmjs.org/@maillayer/core/-/maillayer-1.2.0.tgz"
  sha256 "6bf87d7acc09eeeca0aaeed089ce83112b639c22689902e3b3ab41a25479d995"
  license "MIT"

  depends_on "node"

  def install
    package_root = buildpath/"package"
    install_root = package_root.directory? ? package_root : buildpath

    libexec.install install_root.children
    bin.install_symlink libexec/"dist/cli.js" => "maillayer"
  end

  test do
    assert_match "MailLayer adapters", shell_output("#{bin}/maillayer adapters")
  end
end
