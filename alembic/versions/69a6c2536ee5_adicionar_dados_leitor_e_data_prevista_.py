"""adicionar dados leitor e data prevista devolucao

Revision ID: 69a6c2536ee5
Revises: 398d88f69706
Create Date: 2026-09-02 14:09:16.237472
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = "69a6c2536ee5"

down_revision: Union[
    str,
    Sequence[str],
    None
] = "398d88f69706"

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
    """Upgrade schema."""

    # ========================================
    # EMPRESTIMO
    # ========================================

    op.add_column(
        "emprestimo",
        sa.Column(
            "data_prevista_devolucao",
            sa.Date(),
            nullable=True
        )
    )


    # ========================================
    # LEITOR
    # ========================================

    op.add_column(
        "leitor",
        sa.Column(
            "telefone",
            sqlmodel.sql.sqltypes.AutoString(),
            nullable=True
        )
    )


    op.add_column(
        "leitor",
        sa.Column(
            "endereco",
            sqlmodel.sql.sqltypes.AutoString(),
            nullable=True
        )
    )


    op.add_column(
        "leitor",
        sa.Column(
            "data_cadastro",
            sa.Date(),
            nullable=True
        )
    )


    # Preenche leitores que já existiam
    op.execute(
        """
        UPDATE leitor
        SET data_cadastro = CURRENT_DATE
        WHERE data_cadastro IS NULL
        """
    )


    # Depois de preencher os registros antigos,
    # torna a coluna obrigatória.
    op.alter_column(
        "leitor",
        "data_cadastro",
        existing_type=sa.Date(),
        nullable=False
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        "leitor",
        "data_cadastro"
    )

    op.drop_column(
        "leitor",
        "endereco"
    )

    op.drop_column(
        "leitor",
        "telefone"
    )

    op.drop_column(
        "emprestimo",
        "data_prevista_devolucao"
    )