{
  description = "data4oov (datadex-wireframe) development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            # Infrastructure
            docker
            docker-compose
            postgresql # for psql client
            
            # Frontend (Next.js)
            nodejs_24
            yarn
            
            # Machine Learning & Scripts
            python311
            ruff
          ];

          shellHook = ''
            echo "❄️  data4oov (datadex-wireframe) Nix Shell Loaded"
            echo "Node: $(node --version) | Yarn: $(yarn --version) | Python: $(python3 --version)"
            
            # Ensure local node_modules/.bin is in PATH for the frontend
            export PATH="$PWD/frontend/node_modules/.bin:$PATH"
          '';
        };
      });
}
