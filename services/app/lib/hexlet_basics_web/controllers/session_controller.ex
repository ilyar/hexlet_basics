defmodule HexletBasicsWeb.SessionController do
  use HexletBasicsWeb, :controller

  def delete(conn, _params) do
    conn
    |> put_flash(:info, gettext "You have been logged out!")
    |> configure_session(drop: true)
    |> redirect(to: "/")
  end
end
