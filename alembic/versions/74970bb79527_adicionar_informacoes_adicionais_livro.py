"""adicionar informacoes adicionais livro

Revision ID: 74970bb79527
Revises: 69a6c2536ee5
Create Date: 2026-09-16 11:18:49.268251
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = "74970bb79527"

down_revision: Union[
    str,
    Sequence[str],
    None
] = "69a6c2536ee5"

branch_labels: Union[
    str,
    Sequence[str],
    None
] = None

depends_on: Union[
    str,
    Sequence[str],
    None
] = None


def upgrade() -> None:
    """Adiciona informações adicionais ao livro."""

    op.add_column(
        "livro",
        sa.Column(
            "editora",
            sqlmodel.sql.sqltypes.AutoString(),
            nullable=True
        )
    )

    op.add_column(
        "livro",
        sa.Column(
            "ano_publicacao",
            sa.Integer(),
            nullable=True
        )
    )

    op.add_column(
        "livro",
        sa.Column(
            "edicao",
            sqlmodel.sql.sqltypes.AutoString(),
            nullable=True
        )
    )

    op.add_column(
        "livro",
        sa.Column(
            "numero_paginas",
            sa.Integer(),
            nullable=True
        )
    )

    op.add_column(
        "livro",
        sa.Column(
            "descricao",
            sa.Text(),
            nullable=True
        )
    )


def downgrade() -> None:
    """Remove informações adicionais do livro."""

    op.drop_column(
        "livro",
        "descricao"
    )

    op.drop_column(
        "livro",
        "numero_paginas"
    )

    op.drop_column(
        "livro",
        "edicao"
    )

    op.drop_column(
        "livro",
        "ano_publicacao"
    )

    op.drop_column(
        "livro",
        "editora"
    )